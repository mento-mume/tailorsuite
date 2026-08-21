import Input from '../ui/Input'
import { Bell, Search, PanelLeft } from 'lucide-react'


interface TopNavProps {
  userName: string
  onSearch?: (value: string) => void
  onToggleSidebar?: () => void
}

export default function TopNav({ userName, onSearch, onToggleSidebar }: TopNavProps) {
  const initials = userName.split(' ').map((word) => word[0]).join('').toUpperCase()

  return (
    <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center  px-8 gap-6">
      <button className="w-9 h-9 rounded-[10px] flex items-center justify-center text-text-secondary hover:bg-gray-100" onClick={onToggleSidebar}><PanelLeft size={20} /></button>
      <div className="max-w-[360px] w-full">
        <Input
        icon={<Search size={18} />}
          placeholder="Search orders, customers…"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-5 ml-auto">
     
<button className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-100">
  <Bell size={20} />
  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-white" />
</button>

        <div className="flex items-center gap-2.5 pl-4 border-l border-[#E5E7EB]">
          <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <span className="text-sm font-semibold">{userName}</span>
        </div>
      </div>
    </header>
  )
}