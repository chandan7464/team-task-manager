import useAuthStore from '../../store/authStore'

export default function Navbar({ title = 'Dashboard' }) {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur border-b border-dark-600 flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-200">{user?.username}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
