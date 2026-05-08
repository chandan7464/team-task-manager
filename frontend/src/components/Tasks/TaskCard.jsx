import { Calendar, Trash2 } from 'lucide-react'
import { formatDate, isOverdue } from '../../utils/dateUtils'
import useAuthStore from '../../store/authStore'
import api from '../../api/client'
import toast from 'react-hot-toast'

export default function TaskCard({ task, onTaskUpdated }) {
  const { user, isAdmin } = useAuthStore()
  
  const overdue = isOverdue(task.due_date, task.status)
  
  // Can only update if admin OR assigned member
  const canUpdate = isAdmin() || user?.id === task.assigned_to

  const handleDelete = async (e) => {
    e.stopPropagation() // Prevent drag event or card click
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await api.delete(`/api/tasks/${task.id}`)
      toast.success('Task deleted')
      onTaskUpdated()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!canUpdate) {
      toast.error("You can only update tasks assigned to you.")
      return
    }
    try {
      await api.patch(`/api/tasks/${task.id}`, { status: newStatus })
      toast.success('Status updated')
      onTaskUpdated()
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className={`card p-4 hover:border-primary-600/50 transition-colors ${overdue ? 'border-red-500/30 bg-red-500/5' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-100 text-sm">{task.title}</h4>
        {isAdmin() && (
          <button 
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {task.due_date && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
            overdue 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-dark-600 text-gray-300'
          }`}>
            <Calendar size={10} />
            {formatDate(task.due_date)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-dark-600/50">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <>
              <div className="w-6 h-6 rounded-full bg-primary-600/30 flex items-center justify-center text-[10px] font-bold text-primary-300">
                {task.assignee.username[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-400">{task.assignee.username}</span>
            </>
          ) : (
            <span className="text-xs text-gray-500 italic">Unassigned</span>
          )}
        </div>

        {canUpdate && (
          <select 
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-dark-700 text-xs border border-dark-500 rounded px-2 py-1 text-gray-300 outline-none focus:border-primary-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        )}
      </div>
    </div>
  )
}
