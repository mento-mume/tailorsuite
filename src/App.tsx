import { useState,useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Customers from './pages/Customer'
import Expenses from './pages/Expenses'
import { onAuthStateChanged,  type User } from 'firebase/auth'
import { auth, db } from './lib/firebase'
import Login from './pages/Login'
import { collection,  addDoc } from 'firebase/firestore'
import { type Order } from './data/orderTypes'
import { useFirestoreCollection } from './hooks/useFirestoreCollection'
import { type Customer } from './data/customerTypes'
import { type Expense } from './data/expensesTypes'
function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [activePath, setActivePath] = useState('/')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const orders = useFirestoreCollection<Order>('orders')
  const customers = useFirestoreCollection<Customer>('customers')
  const expenses = useFirestoreCollection<Expense>('expenses')
  
  async function addOrder(newOrder: Omit<Order, 'id'>) {
    await addDoc(collection(db, 'orders'), newOrder)
  }
  
    async function addCustomer(newCustomer: Omit<Customer, 'id'>) {
      await addDoc(collection(db, 'customers'), newCustomer)
    }
  
    async function addExpense(newExpense: Omit<Expense, 'id'>) {
      await addDoc(collection(db, 'expenses'), newExpense)
    }
    

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [])

  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  if (!user) {
    return <Login />
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
