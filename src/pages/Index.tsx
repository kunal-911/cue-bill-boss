import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TableCard, Table } from "@/components/TableCard";
import { BillingOverview } from "@/components/BillingOverview";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/billiards-hero.jpg";

const Index = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, status: 'available', hourlyRate: 25 },
    { id: 2, status: 'available', hourlyRate: 25 },
    { id: 3, status: 'available', hourlyRate: 30 },
    { id: 4, status: 'available', hourlyRate: 30 },
    { id: 5, status: 'available', hourlyRate: 35 },
    { id: 6, status: 'available', hourlyRate: 35 },
    { id: 7, status: 'available', hourlyRate: 40 },
    { id: 8, status: 'available', hourlyRate: 40 },
  ]);

  // Update bills every second for occupied tables
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => {
          if (table.status === 'occupied' && table.startTime) {
            const hoursPlayed = (new Date().getTime() - table.startTime.getTime()) / (1000 * 60 * 60);
            return { ...table, currentBill: hoursPlayed * table.hourlyRate };
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
        ? { ...table, status: 'occupied' as const, player: playerName, startTime: new Date() }
        : table
    ));
    
    toast({
      title: "Game Started",
      description: `${playerName} started playing on Table ${tableId}`,
    });
  };

  const handleEndGame = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.startTime) {
      const hoursPlayed = (new Date().getTime() - table.startTime.getTime()) / (1000 * 60 * 60);
      const finalBill = hoursPlayed * table.hourlyRate;
      
      setTables(prev => prev.map(t => 
        t.id === tableId 
          ? { ...t, status: 'available' as const, player: undefined, startTime: undefined, currentBill: undefined }
          : t
      ));
      
      toast({
        title: "Game Ended",
        description: `${table.player}'s final bill: $${finalBill.toFixed(2)}`,
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
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Table Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onStartGame={handleStartGame}
                onEndGame={handleEndGame}
                onReserveTable={handleReserveTable}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;