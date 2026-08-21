
//import Button from './components/ui/Button'
//import Input from './components/ui/Input'
//import Card from './components/ui/Card'

//import Badge, { type OrderStatus } from "./components/ui/Badge"
//import Table from "./components/ui/Table"
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
function App() {
  

  const [activePath, setActivePath] = useState('/')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex">
  <Sidebar activePath={activePath} onNavigate={setActivePath} isCollapsed={isSidebarCollapsed} />
  <div className="flex-1 flex flex-col">
    <TopNav userName="Amaka Okoro" onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />
    <main className="flex-1 p-8">{activePath}</main>
  </div>
</div>
  )
}

export default App
