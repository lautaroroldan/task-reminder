"use client"

import { useState, useEffect } from "react"
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import type { Task } from "@/lib/types"
import { getTasks } from "@/app/actions/tasks"

export default function TaskDashboard({ token }: { token: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar tareas al inicio
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true)
        const serverTasks = await getTasks()
        setTasks(serverTasks)
        setError("")
      } catch (err) {
        console.error("Error al cargar las tareas:", err)
        setError("No se pudieron cargar las tareas")
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  // Modificar la función completeTask para manejar tareas no recurrentes
  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          // Marcar como completado para el mes actual
          const today = new Date()
          const completionMonth = today.getMonth()
          const completionYear = today.getFullYear()

          // Si la tarea no es recurrente, podríamos eliminarla después de completarla
          // o simplemente marcarla como completada
          if (!task.isRecurring) {
            return {
              ...task,
              completions: [...(task.completions || []), { month: completionMonth, year: completionYear }],
            }
          } else {
            return {
              ...task,
              completions: [...(task.completions || []), { month: completionMonth, year: completionYear }],
            }
          }
        }
        return task
      }),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-violet-600">Cargando tareas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-violet-900">Mis Tareas</h2>
        <TaskForm onAddTask={addTask} token={token} />
      </div>

      <TaskList tasks={tasks} onCompleteTask={completeTask} onDeleteTask={deleteTask} />
    </div>
  )
}
