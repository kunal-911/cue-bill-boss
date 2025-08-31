export interface Table {
  id: number;
  status: 'available' | 'occupied' | 'reserved';
  player?: string;
  startTime?: Date;
  hourlyRate: number;
  currentBill?: number;
  orders?: Order[];
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'appetizers' | 'mains' | 'beverages' | 'cocktails';
  description: string;
  image?: string;
}

export interface Order {
  id: string;
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  timestamp: Date;
}

export interface BillingRecord {
  id: string;
  tableId: number;
  player: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  hourlyRate: number;
  tableCost: number;
  orders: Order[];
  ordersCost: number;
  totalCost: number;
  timestamp: Date;
}