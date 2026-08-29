import Card from "../components/ui/Card"
import { type Order } from "../data/mockOrders"
import { Wallet, ShoppingBag, TrendingUp, CheckCircle2 } from 'lucide-react'
interface ReportsProps {
    orders: Order[]
  }
  
  export default function Reports({ orders }: ReportsProps) {
    const paidOrders = orders.filter((order) => order.isPaid)
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.amount, 0)
    const totalOrdersCount = orders.length
    const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0

    return (
        <div>
          <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-lg font-semibold">Reports</h1>
    <p className="text-sm text-text-secondary mt-0.5">Revenue and order trends over time.</p>
  </div>
  <select className="h-11 rounded-[10px] border border-[#E5E7EB] px-3.5 text-sm bg-white focus:outline-none focus:border-primary">
    <option>Last 6 months</option>
    <option>This year</option>
  </select>
</div>
    
          <div className="grid grid-cols-4 gap-6 mb-6">
          <Card>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm text-text-secondary font-medium">Total Revenue</p>
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
      <Wallet size={18} />
    </div>
  </div>
  <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
</Card>
<Card>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm text-text-secondary font-medium">Orders Completed</p>
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
      <ShoppingBag size={18} />
    </div>
  </div>
  <p className="text-2xl font-bold">₦{totalOrdersCount.toLocaleString()}</p>
</Card>
<Card>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm text-text-secondary font-medium">Average Order Value</p>
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
      <TrendingUp size={18} />
    </div>
  </div>
  <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
</Card>
<Card>
  <div className="flex items-center justify-between mb-2">
    <p className="text-sm text-text-secondary font-medium">Repeat Customers</p>
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
      <CheckCircle2 size={18} />
    </div>
  </div>
  <p className="text-2xl font-bold">₦{averageOrderValue.toLocaleString()}</p>
</Card>
          </div>
          <Card title="Monthly Revenue">
        {/* TODO: static placeholder — real monthly grouping needs orders to carry
            actual Date objects instead of display strings like "Aug 6" for dueDate.
            Revisit once Firestore orders store real timestamps in Phase 4. */}
        <div className="flex items-end gap-4 h-[220px] pt-4">
          {[
            { label: 'Mar', height: '60%' },
            { label: 'Apr', height: '75%' },
            { label: 'May', height: '55%' },
            { label: 'Jun', height: '90%' },
            { label: 'Jul', height: '70%' },
            { label: 'Aug', height: '100%' },
          ].map((bar) => (
            <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full max-w-9 rounded-t-md bg-primary" style={{ height: bar.height }} />
              <span className="text-xs text-text-secondary">{bar.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}