"use client"

import type { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trash2, Bell, BellOff, RefreshCw, Calendar } from "lucide-react"
import { isTaskCompletedThisMonth } from "@/lib/task-utils"

interface TaskListProps {
  tasks: Task[]
  onCompleteTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function TaskList({ tasks, onCompleteTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="border-violet-200 shadow-md">
        <CardContent className="p-6">
          <p className="text-center text-violet-500">No hay tareas creadas. Crea una nueva tarea para comenzar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        //const isActive = isTaskActiveToday(task)
        const isCompleted = isTaskCompletedThisMonth(task)

        return (
          <Card
            key={task.id}
            className={`
              rounded-lg border bg-card border-violet-200 shadow-sm hover:shadow-md transition-shadow duration-200 py-0 border-l-4
              ${isCompleted ? "bg-violet-50" : ""}
            `}
            style={{
              borderLeftColor: task.color || "#FFC0CB"
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? "text-gray-500" : "text-gray-900"}`}>{task.title.toUpperCase()}</h3>
                  {task.user && (
                    <p className="text-sm text-violet-600 font-medium">
                      Usuario: {task.user}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Días: {task.startDay}{task.startDay === task.endDay ? "" : ` al ${task.endDay}`} de cada mes
                  </p>
                  <div className="flex mt-1 space-x-4">
                    <span className="text-xs flex items-center gap-1 text-gray-500">
                      {task.isRecurring ? (
                        <>
                          <RefreshCw className="h-3 w-3" />
                          <span>Mensual</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-3 w-3" />
                          <span>Una vez</span>
                        </>
                      )}
                    </span>
                    <span className="text-xs flex items-center gap-1 text-gray-500">
                      {task.enableNotifications ? (
                        <>
                          <Bell className="h-3 w-3" />
                          <span>Notificaciones activas</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="h-3 w-3" />
                          <span>Sin notificaciones</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!isCompleted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCompleteTask(task.id)}
                      className="flex items-center gap-1 border-violet-300 text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Completar</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteTask(task.id)}
                    className="flex items-center gap-1 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </div>

              {isCompleted && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completada este mes</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
