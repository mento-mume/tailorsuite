import type { OrderStatus } from "../components/ui/Badge";

// orderTypes.ts
export interface Order {
  id: string;
  customerId: string;
  customer: string;
  item: string;
  status: OrderStatus;
  dueDate: string;
  amount: number;
  createdBy: string;
  createdByName: string;
  createdAt: number;
}
export type OrderStatusFilter = OrderStatus | "All";
