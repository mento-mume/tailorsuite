import type { OrderStatus } from '../components/ui/Badge'

export interface Order {
  id: string
  customer: string
  item: string
  status: OrderStatus
  dueDate: string
  amount: number
  isPaid: boolean
}
export type OrderStatusFilter = OrderStatus | 'All'

export const mockOrders: Order[] = [
  { id: '1044', customer: 'Grace Effiong', item: 'Wedding dress', status: 'Received', dueDate: 'Aug 14', amount: 180000, isPaid: false },
  { id: '1043', customer: 'Tunde Bello', item: 'Native wear', status: 'Ironing', dueDate: 'Aug 8', amount: 42000, isPaid: true },
  { id: '1042', customer: 'Chidi Nwosu', item: 'Agbada set', status: 'Sewing', dueDate: 'Aug 6', amount: 65000, isPaid: false },
  { id: '1041', customer: 'Funke Alade', item: 'Ankara gown', status: 'Ready', dueDate: 'Aug 6', amount: 38000, isPaid: true },
  { id: '1039', customer: 'Emeka Obi', item: 'Kaftan', status: 'Measuring', dueDate: 'Aug 7', amount: 60000, isPaid: false },
  { id: '1037', customer: 'Bisi Adeyemi', item: 'Corporate suit', status: 'Cutting', dueDate: 'Aug 5', amount: 150000, isPaid: false },
  { id: '1035', customer: 'Ngozi Umeh', item: 'Ankara jacket', status: 'Delivered', dueDate: 'Aug 1', amount: 28000, isPaid: true },
  { id: '1031', customer: 'Yusuf Aliyu', item: 'Kaftan', status: 'Cancelled', dueDate: '—', amount: 0, isPaid: false },
]