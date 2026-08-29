import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { type Customer } from '../data/mockCustomers'
const avatarColors = ['bg-primary', 'bg-secondary', 'bg-violet-600', 'bg-orange-500', 'bg-success', 'bg-emerald-500']

interface CustomersProps {
  customers: Customer[]
  onAddCustomer: (customer: Customer) => void
}


  export default function Customers({ customers, onAddCustomer }: CustomersProps) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' })
    function getAvatarColor(index: number) {
      return avatarColors[index % avatarColors.length]
    }
    function getInitials(name: string) {
        return name.split(' ').map((word) => word[0]).join('').toUpperCase()
      }
      
    function updateField(field: keyof typeof newCustomer, value: string) {
      setNewCustomer((prev) => ({ ...prev, [field]: value }))
    }
    
    function closeModal() {
      setIsModalOpen(false)
      setNewCustomer({ name: '', phone: '' })
    }
    
    function handleCreateCustomer() {
      const customer: Customer = {
        id: Date.now().toString(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        ordersCount: 0,
        amountOwed: 0,
      }
    
      onAddCustomer(customer)
      closeModal()
    }
    
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold">Customers</h1>
            <p className="text-sm text-text-secondary mt-0.5">Everyone who's ever placed an order.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
    New Customer
  </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <Card key={customer.id}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-11 h-11 rounded-full text-white flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(index)}`}
              >
                {getInitials(customer.name)}
              </div>
              <div>
                <p className="text-base font-semibold">{customer.name}</p>
                <p className="text-xs text-text-secondary">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <div>
                <p className="text-base font-bold">{customer.ordersCount}</p>
                <p className="text-xs text-text-secondary">Orders</p>
              </div>
              <div>
                <p className={`text-base font-bold ${customer.amountOwed > 0 ? 'text-danger' : 'text-text-primary'}`}>
                  ₦{customer.amountOwed.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary">Balance</p>
              </div>
            </div>
          </Card>

        ))}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="New Customer">
  <div className="flex flex-col gap-4">
    <Input
      label="Full name"
      placeholder="e.g. Grace Effiong"
      value={newCustomer.name}
      onChange={(e) => updateField('name', e.target.value)}
    />
    <Input
      label="Phone number"
      placeholder="e.g. 0803 111 2222"
      value={newCustomer.phone}
      onChange={(e) => updateField('phone', e.target.value)}
    />
    <div className="flex justify-end gap-3 mt-2">
      <Button variant="secondary" onClick={closeModal}>Cancel</Button>
      <Button onClick={handleCreateCustomer}>Create Customer</Button>
    </div>
  </div>
</Modal>
      </div>
    </div>
  )
}