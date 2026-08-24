import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customer'
function App() {
  

  const [activePath, setActivePath] = useState('/')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  function renderPage() {
    if (activePath === '/orders') return <Orders />
    if (activePath === '/customers') return <Customers />
    return <Dashboard />
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
