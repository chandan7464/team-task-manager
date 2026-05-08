import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, FolderOpen } from 'lucide-react'
import api from '../api/client'
import Navbar from '../components/Layout/Navbar'
import StatsCard from '../components/Dashboard/StatsCard'

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard/stats')
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <Navbar title="Dashboard" />
        <div className="p-6 flex items-center justify-center flex-1">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary-600/20 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-dark-600 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <Navbar title="Dashboard" />
        <div className="p-6 text-red-400 flex items-center justify-center flex-1">
          Failed to load dashboard stats.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <Navbar title="Dashboard Overview" />
      
      <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            label="Total Projects" 
            value={stats?.total_projects} 
            icon={FolderOpen} 
            color="indigo" 
          />
          <StatsCard 
            label="Total Tasks" 
            value={stats?.total_tasks} 
            icon={LayoutDashboard} 
            color="blue" 
          />
          <StatsCard 
            label="Completed Tasks" 
            value={stats?.completed} 
            icon={CheckCircle2} 
            color="green" 
          />
          <StatsCard 
            label="In Progress" 
            value={stats?.in_progress} 
            icon={Clock} 
            color="yellow" 
          />
        </div>

        {stats?.overdue > 0 && (
          <div className="mt-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex items-start gap-4">
              <div className="bg-red-500/20 p-3 rounded-full text-red-400 mt-1">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-1">Attention Needed</h3>
                <p className="text-red-300/80">
                  You have <span className="font-bold">{stats.overdue}</span> overdue {stats.overdue === 1 ? 'task' : 'tasks'}. 
                  Please check your projects and update their status.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
