import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, ShoppingCart, Utensils } from "lucide-react";
import { useState, useEffect } from "react";
import { Table, Order } from "@/types";

interface TableCardProps {
  table: Table;
  onStartGame: (tableId: number, playerName: string) => void;
  onEndGame: (tableId: number) => void;
  onReserveTable: (tableId: number) => void;
  onOpenMenu: (tableId: number) => void;
}

export const TableCard = ({ table, onStartGame, onEndGame, onReserveTable, onOpenMenu }: TableCardProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (table.status === 'occupied' && table.startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - table.startTime!.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [table.status, table.startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateCurrentBill = () => {
    let tableCost = 0;
    if (table.status === 'occupied' && table.startTime) {
      const hoursPlayed = elapsedTime / 3600;
      tableCost = hoursPlayed * table.hourlyRate;
    }
    
    const ordersCost = table.orders?.reduce((sum, order) => 
      sum + (order.menuItem.price * order.quantity), 0) || 0;
    
    return tableCost + ordersCost;
  };

  const getStatusColor = () => {
    switch (table.status) {
      case 'available': return 'bg-primary text-primary-foreground';
      case 'occupied': return 'bg-destructive text-destructive-foreground';
      case 'reserved': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-[var(--shadow-billiards)] transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-billiards-gold">
            Table {table.id}
          </CardTitle>
          <Badge className={getStatusColor()}>
            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          ${table.hourlyRate}/hour
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {table.status === 'occupied' && (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Player: {table.player}
              </div>
              <div className="flex items-center gap-2 text-billiards-felt">
                <Timer className="h-4 w-4" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <div className="text-lg font-bold text-billiards-gold">
                Current Bill: ${calculateCurrentBill().toFixed(2)}
              </div>
              {table.orders && table.orders.length > 0 && (
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2 text-billiards-felt">
                    <Utensils className="h-4 w-4" />
                    <span>Orders: {table.orders.length} items</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onOpenMenu(table.id)}
                variant="outline"
                className="flex-1 border-billiards-gold text-billiards-gold hover:bg-billiards-gold hover:text-primary-foreground"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Order
              </Button>
              <Button 
                onClick={() => onEndGame(table.id)}
                className="flex-1 bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
              >
                End Game
              </Button>
            </div>
          </>
        )}

        {table.status === 'available' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (playerName.trim()) {
                    onStartGame(table.id, playerName);
                    setPlayerName("");
                  }
                }}
                disabled={!playerName.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Start Game
              </Button>
              <Button 
                onClick={() => onReserveTable(table.id)}
                variant="outline"
                className="flex-1 border-billiards-gold text-billiards-gold hover:bg-billiards-gold hover:text-primary-foreground"
              >
                Reserve
              </Button>
            </div>
          </div>
        )}

        {table.status === 'reserved' && (
          <div className="text-center py-4">
            <div className="text-billiards-gold font-medium mb-3">
              Table Reserved
            </div>
            <Button 
              onClick={() => onReserveTable(table.id)}
              variant="outline"
              className="border-billiards-gold text-billiards-gold hover:bg-billiards-gold hover:text-primary-foreground"
            >
              Cancel Reservation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};