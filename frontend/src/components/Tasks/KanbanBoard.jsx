import TaskCard from './TaskCard'

const columns = [
  { id: 'todo', title: 'To Do', color: 'border-gray-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-blue-500' },
  { id: 'done', title: 'Done', color: 'border-green-500' }
]

export default function KanbanBoard({ tasks, onTaskUpdated }) {
  
  return (
    <div className="h-full flex gap-6 overflow-x-auto pb-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        
        return (
          <div key={col.id} className="flex flex-col w-80 shrink-0">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
              <h3 className="font-semibold text-gray-200">{col.title}</h3>
              <span className="bg-dark-600 text-gray-300 text-xs py-0.5 px-2 rounded-full font-medium">
                {colTasks.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {colTasks.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-dark-600 rounded-xl">
                  No tasks here
                </div>
              ) : (
                colTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onTaskUpdated={onTaskUpdated}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
