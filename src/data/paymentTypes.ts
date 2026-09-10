export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  paidAt: number;
  recordedBy: string;
  recordedByName: string;
}
