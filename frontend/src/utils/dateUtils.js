import { format, isValid, parseISO } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    return isValid(d) ? format(d, 'MMM dd, yyyy') : '—'
  } catch {
    return '—'
  }
}

export const isOverdue = (dueDateStr, status) => {
  if (!dueDateStr || status === 'done') return false
  try {
    const d = typeof dueDateStr === 'string' ? parseISO(dueDateStr) : new Date(dueDateStr)
    return d < new Date()
  } catch {
    return false
  }
}

export const getDaysLeft = (dueDateStr) => {
  if (!dueDateStr) return null
  try {
    const d = new Date(dueDateStr)
    const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
    return diff
  } catch {
    return null
  }
}
