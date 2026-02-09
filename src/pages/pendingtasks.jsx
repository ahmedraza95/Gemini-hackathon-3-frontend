// src/pages/pendingtasks.jsx
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

const PendingTasks = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3)
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  if (totalTasks === 0) {
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
    >
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Pending Tasks</h3>
                <p className="text-sm text-gray-600">
                  {pendingTasks.length} pending • {completedTasks} completed
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {Math.round((completedTasks / totalTasks) * 100)}%
            </div>
            <p className="text-sm text-gray-600">Progress</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </div>
        </div>

        {/* Pending Tasks List */}
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50"
              >
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-600">{task.duration}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">Day {task.day}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">All tasks completed!</p>
          </motion.div>
        )}

        {totalTasks > 3 && (
          <p className="text-xs text-gray-600 text-center mt-4">
            +{totalTasks - 3} more tasks
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default PendingTasks
