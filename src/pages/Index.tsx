import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TableCard } from "@/components/TableCard";
import { BillingOverview } from "@/components/BillingOverview";
import { FoodMenu } from "@/components/FoodMenu";
import { BillingHistory } from "@/components/BillingHistory";
import { toast } from "@/hooks/use-toast";
import { Table, MenuItem, Order, BillingRecord } from "@/types";
import { menuItems } from "@/data/menuItems";
import heroImage from "@/assets/billiards-hero.jpg";

const Index = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, status: 'available', hourlyRate: 25, orders: [] },
    { id: 2, status: 'available', hourlyRate: 25, orders: [] },
    { id: 3, status: 'available', hourlyRate: 30, orders: [] },
    { id: 4, status: 'available', hourlyRate: 30, orders: [] },
    { id: 5, status: 'available', hourlyRate: 35, orders: [] },
    { id: 6, status: 'available', hourlyRate: 35, orders: [] },
    { id: 7, status: 'available', hourlyRate: 40, orders: [] },
    { id: 8, status: 'available', hourlyRate: 40, orders: [] },
  ]);

  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>(() => {
    const saved = localStorage.getItem('billingHistory');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startTime' || key === 'endTime' || key === 'timestamp') {
        return new Date(value);
      }
      if (key === 'timestamp' && value) {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  // Save billing history to localStorage
  useEffect(() => {
    localStorage.setItem('billingHistory', JSON.stringify(billingHistory));
  }, [billingHistory]);

  // Update bills every second for occupied tables
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => {
          if (table.status === 'occupied' && table.startTime) {
            const hoursPlayed = (new Date().getTime() - table.startTime.getTime()) / (1000 * 60 * 60);
            const tableCost = hoursPlayed * table.hourlyRate;
            const ordersCost = table.orders?.reduce((sum, order) => 
              sum + (order.menuItem.price * order.quantity), 0) || 0;
            return { ...table, currentBill: tableCost + ordersCost };
          }
          return table;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = (tableId: number, playerName: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: 'occupied' as const, player: playerName, startTime: new Date(), orders: [] }
        : table
    ));
    
    toast({
      title: "Game Started",
      description: `${playerName} started playing on Table ${tableId}`,
    });
  };

  const handleEndGame = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.startTime && table.player) {
      const endTime = new Date();
      const duration = (endTime.getTime() - table.startTime.getTime()) / (1000 * 60 * 60);
      const tableCost = duration * table.hourlyRate;
      const ordersCost = table.orders?.reduce((sum, order) => 
        sum + (order.menuItem.price * order.quantity), 0) || 0;
      const totalCost = tableCost + ordersCost;
      
      // Add to billing history
      const billingRecord: BillingRecord = {
        id: `${tableId}-${Date.now()}`,
        tableId: table.id,
        player: table.player,
        startTime: table.startTime,
        endTime,
        duration,
        hourlyRate: table.hourlyRate,
        tableCost,
        orders: table.orders || [],
        ordersCost,
        totalCost,
        timestamp: endTime
      };
      
      setBillingHistory(prev => [billingRecord, ...prev]);
      
      setTables(prev => prev.map(t => 
        t.id === tableId 
          ? { ...t, status: 'available' as const, player: undefined, startTime: undefined, currentBill: undefined, orders: [] }
          : t
      ));
      
      toast({
        title: "Game Ended",
        description: `${table.player}'s final bill: $${totalCost.toFixed(2)}`,
      });
    }
  };

  const handleReserveTable = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    
    setTables(prev => prev.map(t => 
      t.id === tableId 
        ? { ...t, status: t.status === 'reserved' ? 'available' as const : 'reserved' as const }
        : t
    ));
    
    toast({
      title: table?.status === 'reserved' ? "Reservation Cancelled" : "Table Reserved",
      description: `Table ${tableId} has been ${table?.status === 'reserved' ? 'made available' : 'reserved'}`,
    });
  };

  const handleAddOrder = (tableId: number, menuItem: MenuItem, quantity: number) => {
    const newOrder: Order = {
      id: `${tableId}-${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      menuItem,
      quantity,
      status: 'pending',
      timestamp: new Date()
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, orders: [...(table.orders || []), newOrder] }
        : table
    ));

    toast({
      title: "Order Added",
      description: `${quantity}x ${menuItem.name} added to Table ${tableId}`,
    });
  };

  const handleOpenMenu = (tableId: number) => {
    // This will be handled by the FoodMenu component
    return;
  };

  const occupiedTables = tables.filter(t => t.status === 'occupied').map(t => t.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Billiards Hall" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-billiards-gold via-primary to-billiards-felt bg-clip-text text-transparent">
              Premium Billiards Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional table management and automated billing system
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Billing Overview */}
        <BillingOverview tables={tables} />
        
        {/* Tables Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              Table Status
            </h3>
            <div className="flex gap-4">
              <FoodMenu 
                onAddOrder={handleAddOrder} 
                availableTables={occupiedTables}
              />
              <BillingHistory billingHistory={billingHistory} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onStartGame={handleStartGame}
                onEndGame={handleEndGame}
                onReserveTable={handleReserveTable}
                onOpenMenu={handleOpenMenu}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;