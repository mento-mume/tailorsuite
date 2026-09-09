import type { Order } from "../data/orderTypes";
import type { Payment } from "../data/paymentTypes";

export function getAmountPaid(orderId: string, payments: Payment[]): number {
  return payments
    .filter((p) => p.orderId === orderId)
    .reduce((sum, p) => sum + p.amount, 0);
}

export function getOrderBalance(order: Order, payments: Payment[]): number {
  return order.amount - getAmountPaid(order.id, payments);
}

export function isOrderPaid(order: Order, payments: Payment[]): boolean {
  return getOrderBalance(order, payments) <= 0;
}

export function getCustomerBalance(
  customerId: string,
  orders: Order[],
  payments: Payment[],
): number {
  return orders
    .filter((o) => o.customerId === customerId)
    .reduce((sum, order) => sum + getOrderBalance(order, payments), 0);
}
