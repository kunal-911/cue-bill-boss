import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BillingRecord } from "@/types";
import { History, Clock, DollarSign, Utensils, User } from "lucide-react";

interface BillingHistoryProps {
  billingHistory: BillingRecord[];
}

export const BillingHistory = ({ billingHistory }: BillingHistoryProps) => {
  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const totalRevenue = billingHistory.reduce((sum, record) => sum + record.totalCost, 0);
  const totalGames = billingHistory.length;
  const averageBill = totalGames > 0 ? totalRevenue / totalGames : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-billiards-gold text-billiards-gold hover:bg-billiards-gold hover:text-primary-foreground">
          <History className="mr-2 h-4 w-4" />
          Billing History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] bg-gradient-to-br from-card to-card/95">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-billiards-gold">
            Billing History
          </DialogTitle>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-billiards-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold text-billiards-gold">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Games</p>
                    <p className="text-xl font-bold text-primary">{totalGames}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Bill</p>
                    <p className="text-xl font-bold text-accent">${averageBill.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {billingHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No billing history available yet.
              </div>
            ) : (
              billingHistory
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((record) => (
                  <Card key={record.id} className="animate-fade-in border-border/50 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-billiards-gold">
                            Table {record.tableId} - {record.player}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(record.startTime)} - {formatDateTime(record.endTime)}
                          </p>
                        </div>
                        <Badge className="bg-billiards-gold text-primary-foreground font-bold text-lg">
                          ${record.totalCost.toFixed(2)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Table Charges */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Table Charges
                          </h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{formatDuration(record.duration)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Rate:</span>
                              <span>${record.hourlyRate}/hour</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Table Total:</span>
                              <span className="text-primary">${record.tableCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Orders */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-billiards-felt flex items-center gap-2">
                            <Utensils className="h-4 w-4" />
                            Orders ({record.orders.length})
                          </h4>
                          {record.orders.length > 0 ? (
                            <div className="text-sm space-y-1 max-h-24 overflow-y-auto">
                              {record.orders.map((order) => (
                                <div key={order.id} className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    {order.quantity}x {order.menuItem.name}
                                  </span>
                                  <span>${(order.menuItem.price * order.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between font-medium pt-1 border-t border-border">
                                <span>Orders Total:</span>
                                <span className="text-billiards-felt">${record.ordersCost.toFixed(2)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No orders</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};