import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import api from '../api/client'
import Navbar from '../components/Layout/Navbar'
import ProjectCard from '../components/Projects/ProjectCard'
import useAuthStore from '../store/authStore'
import { useState } from 'react'
import CreateProjectModal from '../components/Projects/CreateProjectModal'

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAdmin } = useAuthStore()

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/api/projects')
      return data
    }
  })

  return (
    <div className="flex-1 flex flex-col h-full">
      <Navbar title="Projects" />
      
      <div className="p-6 max-w-6xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">All Projects</h1>
            <p className="text-sm text-gray-400">Manage and track your team's projects</p>
          </div>
          
          {isAdmin() && (
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus size={18} />
              New Project
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card h-48 animate-pulse flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-dark-600 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-dark-600 rounded w-3/4"></div>
                    <div className="h-3 bg-dark-600 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-dark-600 rounded w-full"></div>
                  <div className="h-4 bg-dark-600 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-20 card border-dashed border-dark-500">
            <h3 className="text-lg font-medium text-gray-200 mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">You haven't been assigned to any projects yet.</p>
            {isAdmin() && (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary mx-auto">
                <Plus size={18} />
                Create your first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false)
            refetch()
          }} 
        />
      )}
    </div>
  )
}
