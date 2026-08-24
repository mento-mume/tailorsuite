import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { mockOrders, type Order, type OrderStatusFilter } from '../data/mockOrders'
import { Plus, Search } from 'lucide-react'

const statusOptions: OrderStatusFilter[] = [
  'All',
  'Received',
  'Measuring',
  'Cutting',
  'Sewing',
  'Ironing',
  'Ready',
  'Delivered',
  'Cancelled',
]

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('All')

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm)

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Orders</h1>
          <p className="text-sm text-text-secondary mt-0.5">Track every order from received to delivered.</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => console.log('open modal')}>
          New Order
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="max-w-[280px] w-full">
            <Input
              icon={<Search size={18} />}
              placeholder="Search order or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatusFilter)}
            className="h-11 rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All statuses' : status}
              </option>
            ))}
          </select>
        </div>

        <Table<Order>
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          columns={[
            { header: 'Order', render: (order) => order.id },
            { header: 'Customer', render: (order) => order.customer },
            { header: 'Item', render: (order) => order.item },
            { header: 'Status', render: (order) => <Badge status={order.status} /> },
            { header: 'Due date', render: (order) => order.dueDate },
            { header: 'Amount', render: (order) => `₦${order.amount.toLocaleString()}` },
            {
              header: '',
              render: (order) => (
                <Button
                  variant="secondary"
                  className="h-8 px-3 text-sm"
                  onClick={() => console.log('view order', order.id)}
                >
                  View
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}