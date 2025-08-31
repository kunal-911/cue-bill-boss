import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItem, Order } from "@/types";
import { menuItems } from "@/data/menuItems";
import { ShoppingCart, Plus, Utensils, Coffee, Wine, Cookie } from "lucide-react";

interface FoodMenuProps {
  onAddOrder: (tableId: number, menuItem: MenuItem, quantity: number) => void;
  availableTables: number[];
}

export const FoodMenu = ({ onAddOrder, availableTables }: FoodMenuProps) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appetizers': return Cookie;
      case 'mains': return Utensils;
      case 'beverages': return Coffee;
      case 'cocktails': return Wine;
      default: return Utensils;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appetizers': return 'text-accent';
      case 'mains': return 'text-billiards-felt';
      case 'beverages': return 'text-primary';
      case 'cocktails': return 'text-billiards-gold';
      default: return 'text-foreground';
    }
  };

  const handleAddOrder = (menuItem: MenuItem) => {
    if (selectedTable && quantities[menuItem.id]) {
      onAddOrder(selectedTable, menuItem, quantities[menuItem.id]);
      setQuantities(prev => ({ ...prev, [menuItem.id]: 0 }));
    }
  };

  const categories = ['appetizers', 'mains', 'beverages', 'cocktails'] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-billiards-gold to-accent hover:from-billiards-gold/90 hover:to-accent/90 text-primary-foreground">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Order Food & Drinks
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-card to-card/95">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-billiards-gold">
            Food & Drinks Menu
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Select Table:</label>
            <Select onValueChange={(value) => setSelectedTable(parseInt(value))}>
              <SelectTrigger className="w-40 bg-input border-border">
                <SelectValue placeholder="Choose table" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {availableTables.map(tableId => (
                  <SelectItem key={tableId} value={tableId.toString()}>
                    Table {tableId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="appetizers" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              {categories.map(category => {
                const Icon = getCategoryIcon(category);
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <Card key={item.id} className="animate-fade-in border-border/50 hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className={`text-lg ${getCategoryColor(category)}`}>
                              {item.name}
                            </CardTitle>
                            <Badge className="bg-billiards-gold text-primary-foreground font-bold">
                              ${item.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2">
                            <Select
                              onValueChange={(value) => 
                                setQuantities(prev => ({ ...prev, [item.id]: parseInt(value) }))
                              }
                            >
                              <SelectTrigger className="w-20 bg-input border-border">
                                <SelectValue placeholder="Qty" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border">
                                {[1,2,3,4,5].map(qty => (
                                  <SelectItem key={qty} value={qty.toString()}>
                                    {qty}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handleAddOrder(item)}
                              disabled={!selectedTable || !quantities[item.id]}
                              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add to Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};