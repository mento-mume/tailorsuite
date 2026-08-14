
//import Button from './components/ui/Button'
//import Input from './components/ui/Input'
//import Card from './components/ui/Card'

import Badge, { type OrderStatus } from "./components/ui/Badge"
import Table from "./components/ui/Table"

interface Order {
  id: string
  customer: string
  item: string
  status: OrderStatus
  dueDate: string
}

const orders: Order[] = [
  { id: '1042', customer: 'Chidi Nwosu', item: 'Agbada set', status: 'Sewing', dueDate: 'today' },
  { id: '1041', customer: 'Funke Alade', item: 'Ankara gown', status: 'Ready', dueDate: 'tomorrow' },
]
function App() {
  

  return (
    <Table<Order>
  data={orders}
  keyExtractor={(order) => order.id}
  columns={[
    { header: 'Order', render: (order) => order.id },
    { header: 'Customer', render: (order) => order.customer },
    { header: 'Item', render: (order) => order.item },
    { header: 'Status', render: (order) => <Badge status={order.status} /> },
    { header: 'Due Date', render: (order) => order.dueDate },
  ]}
  />
  )
}

export default App
