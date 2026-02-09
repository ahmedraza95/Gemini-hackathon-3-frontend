// src/pages/taskmanager.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, Trash2, Plus, Calendar, Clock, AlertCircle } from 'lucide-react'

const TaskManager = ({ tasks, onAddTask, onCompleteTask, onDeleteTask, steps }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200'
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'Low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'High': return 'from-red-500 to-rose-500'
      case 'Medium': return 'from-amber-500 to-orange-500'
      case 'Low': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Task Manager</h3>
          <p className="text-gray-600">Create tasks from your action plan and track progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.pending}</div>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div className="text-center px-4 py-2 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-indigo-600">
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Add Task from Steps */}
      {steps && steps.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Add Tasks from Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {steps.map(step => {
              const taskExists = tasks.some(t => t.day === step.day)
              return (
                <motion.button
                  key={step.day}
                  whileHover={{ scale: taskExists ? 1 : 1.02 }}
                  onClick={() => !taskExists && onAddTask(step)}
                  disabled={taskExists}
                  className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                    taskExists
                      ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Day {step.day}: {step.title}</div>
                  <div className="text-xs opacity-70 mt-1">{step.duration} • {step.priority}</div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Your Tasks</h4>
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300"
            >
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No tasks yet</p>
              <p className="text-sm text-gray-500">Create tasks from your action plan to get started</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ x: 4 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCompleteTask(task.id)}
                      className="flex-shrink-0 mt-1"
                    >
                      {task.completed ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-1`}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </motion.div>
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1">
                      <h5 className={`font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h5>
                      <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Day {task.day}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.duration}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.completed && (
                          <span className="text-xs text-emerald-600 font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDeleteTask(task.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TaskManager
