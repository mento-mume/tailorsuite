export type OrderStatus =
  | 'Received'
  | 'Measuring'
  | 'Cutting'
  | 'Sewing'
  | 'Ironing'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled'
    
interface BadgeProps {
  status: OrderStatus
}
const statusStyles: Record<OrderStatus, string> = {
    Received: 'bg-gray-100 text-gray-600',
    Measuring: 'bg-blue-50 text-blue-700',
    Cutting: 'bg-violet-50 text-violet-700',
    Sewing: 'bg-orange-50 text-orange-700',
    Ironing: 'bg-indigo-50 text-indigo-700',
    Ready: 'bg-green-50 text-green-700',
    Delivered: 'bg-emerald-50 text-emerald-700',
    Cancelled: 'bg-red-50 text-red-700',
  }
  
  const dotColors: Record<OrderStatus, string> = {
    Received: 'bg-gray-500',
    Measuring: 'bg-primary',
    Cutting: 'bg-violet-600',
    Sewing: 'bg-orange-500',
    Ironing: 'bg-secondary',
    Ready: 'bg-success',
    Delivered: 'bg-emerald-500',
    Cancelled: 'bg-danger',
  }
  export default function Badge({ status }: BadgeProps) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
        {status}
      </span>
    )
  }