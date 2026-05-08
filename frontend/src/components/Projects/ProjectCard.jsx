import { Link } from 'react-router-dom'
import { Folder, Users, CheckSquare, Clock } from 'lucide-react'
import { formatDate } from '../../utils/dateUtils'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="card-hover h-full flex flex-col group">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-primary-400 group-hover:bg-primary-600/20 group-hover:text-primary-300 transition-colors">
            <Folder size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-100 group-hover:text-primary-400 transition-colors line-clamp-1">
              {project.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock size={12} />
              Created {formatDate(project.created_at)}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
          {project.description || 'No description provided.'}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-dark-600/50">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <CheckSquare size={16} className="text-gray-500" />
            <span className="font-medium text-gray-200">{project.task_count || 0}</span> tasks
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Users size={16} className="text-gray-500" />
            <span className="font-medium text-gray-200">{project.member_count || 0}</span> members
          </div>
        </div>
      </div>
    </Link>
  )
}
