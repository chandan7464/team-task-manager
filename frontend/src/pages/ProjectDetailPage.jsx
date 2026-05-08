import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import api from '../api/client'
import Navbar from '../components/Layout/Navbar'
import KanbanBoard from '../components/Tasks/KanbanBoard'
import useAuthStore from '../store/authStore'
import { useState } from 'react'
import CreateTaskModal from '../components/Tasks/CreateTaskModal'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { isAdmin } = useAuthStore()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/projects/${id}`)
      return data
    }
  })

  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/tasks/project/${id}`)
      return data
    }
  })

  if (projectLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <Navbar title="Loading Project..." />
        <div className="p-6 flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <Navbar title={project?.name || 'Project Details'} />
      
      <div className="p-6 max-w-full w-full mx-auto flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Projects
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{project?.name}</h1>
            <p className="text-gray-400 max-w-3xl">{project?.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex -space-x-2 mr-2">
              {project?.members?.slice(0, 5).map((member) => (
                <div key={member.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 border-2 border-dark-900 flex items-center justify-center text-xs font-bold text-white" title={member.username}>
                  {member.username[0].toUpperCase()}
                </div>
              ))}
              {project?.members?.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-900 flex items-center justify-center text-xs font-bold text-white">
                  +{project.members.length - 5}
                </div>
              )}
            </div>

            {isAdmin() && (
              <button onClick={() => setIsTaskModalOpen(true)} className="btn-primary">
                <Plus size={18} />
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="flex-1 min-h-0 bg-dark-800/50 border border-dark-600 rounded-xl p-4 overflow-hidden">
          {tasksLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <KanbanBoard tasks={tasks || []} onTaskUpdated={refetchTasks} projectId={id} members={project?.members || []} />
          )}
        </div>
      </div>

      {isTaskModalOpen && (
        <CreateTaskModal 
          projectId={id}
          members={project?.members || []}
          onClose={() => setIsTaskModalOpen(false)} 
          onSuccess={() => {
            setIsTaskModalOpen(false)
            refetchTasks()
          }} 
        />
      )}
    </div>
  )
}
