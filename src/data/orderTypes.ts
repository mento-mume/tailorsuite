import type { OrderStatus } from "../components/ui/Badge";

export interface Order {
  id: string;
  customer: string;
  item: string;
  status: OrderStatus;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: number;
}
export type OrderStatusFilter = OrderStatus | "All";
