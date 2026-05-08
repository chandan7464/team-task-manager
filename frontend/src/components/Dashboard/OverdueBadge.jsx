import { AlertTriangle } from 'lucide-react'
import { formatDate } from '../../utils/dateUtils'

export default function OverdueBadge({ dueDate }) {
  return (
    <span className="status-badge badge-overdue animate-pulse">
      <AlertTriangle size={10} />
      Overdue · {formatDate(dueDate)}
    </span>
  )
}
