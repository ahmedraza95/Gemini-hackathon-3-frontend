// src/hooks/useTasks.js
import { useState, useEffect } from 'react'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Load tasks from local storage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('problemTasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    }
    setLoading(false)
  }, [])

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('problemTasks', JSON.stringify(tasks))
    }
  }, [tasks, loading])

  const addTask = (step) => {
    const newTask = {
      id: Date.now(),
      title: step.title,
      description: step.description,
      day: step.day,
      duration: step.duration,
      priority: step.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, completed: true, completedAt: new Date().toISOString() }
        : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const clearAllTasks = () => {
    setTasks([])
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, pending, completionRate }
  }

  return {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    clearAllTasks,
    getTaskStats,
    loading
  }
}
