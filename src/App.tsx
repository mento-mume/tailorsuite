import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Customers from './pages/Customer'
import { mockOrders, type Order } from './data/mockOrders'
import { mockCustomers, type Customer } from './data/mockCustomers'
import Expenses from './pages/Expenses'
import { mockExpenses, type Expense } from './data/mockExpenses'

function App() {
  

  const [activePath, setActivePath] = useState('/')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)


  function addOrder(newOrder: Order) {
    setOrders((prev) => [...prev, newOrder])
  }

  function addCustomer(newCustomer: Customer) {
    setCustomers((prev) => [...prev, newCustomer])
  }

  function addExpense(newExpense: Expense) {
    setExpenses((prev) => [...prev, newExpense])
  }
  
  
  function renderPage() {
    if (activePath === '/orders') return <Orders orders={orders} onAddOrder={addOrder}/>
    if (activePath === '/customers') return <Customers customers={customers} onAddCustomer={addCustomer} />
    if (activePath === '/expenses') return <Expenses expenses={expenses} onAddExpense={addExpense} />
    if (activePath === '/reports') return <Reports orders={orders} />

    return <Dashboard orders={orders} />
  }
  return (
    <div className="flex">
  <Sidebar activePath={activePath} onNavigate={setActivePath} isCollapsed={isSidebarCollapsed} />
  <div className="flex-1 flex flex-col">
    <TopNav userName="Amaka Okoro" onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
    <main className="flex-1 p-8">  {renderPage()}</main>
  </div>
</div>
  )
}

export default App
