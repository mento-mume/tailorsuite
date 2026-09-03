import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { type Order, type OrderStatusFilter } from '../data/orderTypes'
import { Plus, Search } from 'lucide-react'
import Modal from '../components/ui/Modal'
import { type OrderStatus } from '../components/ui/Badge' 

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
interface OrdersProps {
  orders: Order[]
  isLoading: boolean
  onAddOrder: (order: Omit<Order, 'id'>) => Promise<void>
}
export default function Orders({orders, isLoading, onAddOrder}: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const [newOrder, setNewOrder] = useState({
    customer: '',
    item: '',
    status: 'Received' as OrderStatus,
    dueDate: '',
    amount: '',
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm)

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function updateField(field: keyof typeof newOrder, value: string) {
    setNewOrder((prev) => ({ ...prev, [field]: value }))
  }
  function closeModal() {
    setIsModalOpen(false)
    setNewOrder({ customer: '', item: '', status: 'Received', dueDate: '', amount: '' })
  }
  
  async function handleCreateOrder() {
    setSubmitError('')
    const order: Omit<Order, 'id'> = {
      customer: newOrder.customer,
      item: newOrder.item,
      status: newOrder.status,
      dueDate: newOrder.dueDate,
      amount: Number(newOrder.amount) || 0,
      isPaid: false,
    }
  
    try {
      await onAddOrder(order)
      closeModal()
    } catch {
      setSubmitError('Could not create order. Check your connection and try again.')
    }
  }
  

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Orders</h1>
          <p className="text-sm text-text-secondary mt-0.5">Track every order from received to delivered.</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
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


        {isLoading ? (
  <div className="py-12 text-center text-sm text-text-secondary">Loading orders…</div>
) : (
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
)}

       
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title="New Order">
  <div className="flex flex-col gap-4">
    <Input
      label="Customer name"
      placeholder="e.g. Chidi Nwosu"
      value={newOrder.customer}
      onChange={(e) => updateField('customer', e.target.value)}
    />

    <Input
      label="Item"
      placeholder="e.g. Agbada set"
      value={newOrder.item}
      onChange={(e) => updateField('item', e.target.value)}
    />

    <div>
      <label className="text-sm font-medium text-text-primary block mb-1.5">Status</label>
      <select
        value={newOrder.status}
        onChange={(e) => updateField('status', e.target.value)}
        className="h-11 w-full rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
      >
        {statusOptions.filter((s) => s !== 'All').map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>

    <Input
      label="Due date"
      type="date"
      value={newOrder.dueDate}
      onChange={(e) => updateField('dueDate', e.target.value)}
    />

    <Input
      label="Amount (₦)"
      type="number"
      placeholder="0"
      value={newOrder.amount}
      onChange={(e) => updateField('amount', e.target.value)}
    />
{submitError && <p className="text-xs text-danger">{submitError}</p>}
    <div className="flex justify-end gap-3 mt-2">
      <Button variant="secondary" onClick={closeModal}>Cancel</Button>
      <Button onClick={handleCreateOrder}>Create Order</Button>
    </div>
  </div>
</Modal>

    </div>
  )
}