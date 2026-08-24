export interface ActivityEntry {
    id: string
    text: string
    timeAgo: string
    color: string
  }
  
  export const mockActivity: ActivityEntry[] = [
    { id: 'a1', text: 'Order #1041 marked Ready', timeAgo: '12 minutes ago', color: 'bg-success' },
    { id: 'a2', text: 'New order #1044 received', timeAgo: '40 minutes ago', color: 'bg-primary' },
    { id: 'a3', text: 'Payment received — ₦18,000', timeAgo: '1 hour ago', color: 'bg-success' },
    { id: 'a4', text: 'Order #1035 delivered', timeAgo: '3 hours ago', color: 'bg-emerald-500' },
  ]