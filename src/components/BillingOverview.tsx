import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Users, TrendingUp } from "lucide-react";
import { Table } from "@/types";

interface BillingOverviewProps {
  tables: Table[];
}

export const BillingOverview = ({ tables }: BillingOverviewProps) => {
  const occupiedTables = tables.filter(t => t.status === 'occupied');
  const totalRevenue = occupiedTables.reduce((sum, table) => {
    let tableCost = 0;
    if (table.startTime) {
      const hoursPlayed = (new Date().getTime() - table.startTime.getTime()) / (1000 * 60 * 60);
      tableCost = hoursPlayed * table.hourlyRate;
    }
    const ordersCost = table.orders?.reduce((orderSum, order) => 
      orderSum + (order.menuItem.price * order.quantity), 0) || 0;
    return sum + tableCost + ordersCost;
  }, 0);

  const totalActivePlayers = occupiedTables.length;
  const averageRate = tables.reduce((sum, table) => sum + table.hourlyRate, 0) / tables.length;
  const occupancyRate = (occupiedTables.length / tables.length) * 100;

  const stats = [
    {
      title: "Current Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-billiards-gold",
      bgColor: "bg-billiards-gold/10"
    },
    {
      title: "Active Players",
      value: totalActivePlayers.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-billiards-felt",
      bgColor: "bg-primary/10"
    },
    {
      title: "Avg. Rate",
      value: `$${averageRate.toFixed(0)}/hr`,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 bg-gradient-to-br from-card to-card/80 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};