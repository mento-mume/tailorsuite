import type { ReactNode } from 'react'
import { LayoutDashboard, Users, ShoppingBag, CreditCard,  LineChart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
    ],
  },
  {
    label: 'Workflow',
    items: [
      { label: 'Orders', path: '/orders', icon: <ShoppingBag /> },
      { label: 'Customers', path: '/customers', icon: <Users /> },
      { label: 'Expenses', path: '/expenses', icon: <CreditCard /> },
      { label: 'Reports', path: '/reports', icon: <LineChart /> },
    ],
  },
]
  interface SidebarProps {
    activePath: string
    onNavigate: (path: string) => void
    isCollapsed: boolean
  }
  
  export default function Sidebar({ isCollapsed }: SidebarProps) {
    const location = useLocation()

    return (
      <aside
  className={`h-screen bg-white border-r border-[#E5E7EB] flex flex-col transition-[width] duration-200 ${isCollapsed ? 'w-20' : 'w-[260px]'}`}
>
        <div className="h-[72px] flex items-center gap-3 px-6 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold">
            TS
          </div>
          {!isCollapsed && <span className="font-bold text-base whitespace-nowrap">TailorSuite</span>}
          
        </div>
{/*   
        <nav className="p-3 flex flex-col gap-1">
  {navSections.map((section) => (
    <div key={section.label} className="mb-2 last:mb-0">
      {!isCollapsed && (
        <div className="text-xs font-semibold text-text-disabled uppercase tracking-wide px-3 pb-2">
          {section.label}
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {section.items.map((item) => {
          const isActive = item.path === activePath

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center gap-3 h-11 px-3 rounded-[10px] text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`}
            >
              <span className="w-[22px] h-[22px] shrink-0">{item.icon}</span>
              {!isCollapsed && item.label}
            </button>
          )
        })}
      </div>
    </div>
  ))}
</nav> */}
<nav className="p-3 flex flex-col gap-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2 last:mb-0">
            {!isCollapsed && <div className="...">{section.label}</div>}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 h-11 px-3 rounded-[10px] text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                    }`}
                  >
                    <span className="w-[22px] h-[22px] shrink-0">{item.icon}</span>
                    {!isCollapsed && item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      </aside>
    )
  }