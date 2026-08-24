import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { mockCustomers } from '../data/mockCustomers'
import { Plus } from 'lucide-react'
const avatarColors = ['bg-primary', 'bg-secondary', 'bg-violet-600', 'bg-orange-500', 'bg-success', 'bg-emerald-500']

function getAvatarColor(index: number) {
  return avatarColors[index % avatarColors.length]
}
function getInitials(name: string) {
    return name.split(' ').map((word) => word[0]).join('').toUpperCase()
  }

  export default function Customers() {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold">Customers</h1>
            <p className="text-sm text-text-secondary mt-0.5">Everyone who's ever placed an order.</p>
          </div>
          <Button icon={<Plus size={18} />} onClick={() => console.log('open modal')}>
            New Customer
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
        {mockCustomers.map((customer, index) => (
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
      </div>
    </div>
  )
}