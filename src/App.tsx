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
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [activePath, setActivePath] = useState('/')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: orders, isLoading: ordersLoading } = useFirestoreCollection<Order>('orders')
  const { data: customers, isLoading: customersLoading } = useFirestoreCollection<Customer>('customers')
  const { data: expenses, isLoading: expensesLoading } = useFirestoreCollection<Expense>('expenses')
 
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

 
 
  return (
    <div className="flex">
  <Sidebar activePath={activePath} onNavigate={setActivePath} isCollapsed={isSidebarCollapsed} />
  <div className="flex-1 flex flex-col">
    <TopNav userName="Amaka Okoro" onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
    
    <main className="flex-1 p-8">  <Routes>
    <Route path="/" element={<Dashboard orders={orders} isLoading={ordersLoading} />} />
    <Route path="/orders" element={<Orders orders={orders} isLoading={ordersLoading} onAddOrder={addOrder} />} />
    <Route path="/customers" element={<Customers customers={customers} isLoading={customersLoading} onAddCustomer={addCustomer} />} />
    <Route path="/expenses" element={<Expenses expenses={expenses} isLoading={expensesLoading} onAddExpense={addExpense} />} />
    <Route path="/reports" element={<Reports orders={orders} isLoading={ordersLoading} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main>
    </div>
</div>
  )
}

export default App
