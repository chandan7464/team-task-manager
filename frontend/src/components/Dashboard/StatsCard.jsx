
const colorMap = {
  indigo: 'from-primary-600/20 to-primary-600/5 border-primary-600/30 text-primary-400',
  green:  'from-green-600/20  to-green-600/5  border-green-600/30  text-green-400',
  blue:   'from-blue-600/20   to-blue-600/5   border-blue-600/30   text-blue-400',
  yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-600/30 text-yellow-400',
  red:    'from-red-600/20    to-red-600/5    border-red-600/30    text-red-400',
  purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/30 text-purple-400',
}

export default function StatsCard({ label, value, icon: Icon, color = 'indigo', subtitle }) {
  const colors = colorMap[color] || colorMap.indigo

  return (
    <div className={`card bg-gradient-to-br ${colors} border animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-gray-100 mt-1">{value ?? 0}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors} border`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
