import type { Task } from "./types"

export function isTaskActiveToday(task: Task): boolean {
  const today = new Date()
  const currentDay = today.getDate()

  return currentDay >= task.startDay && currentDay <= task.endDay
}

export function isTaskCompletedThisMonth(task: Task): boolean {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  return task.completions.some((completion) => completion.month === currentMonth && completion.year === currentYear)
}

export function checkTasksForReminders(tasks: Task[]): {
  remindersNeeded: string[]
} {
  const remindersNeeded: string[] = []

  tasks.forEach((task) => {
    // Solo mostrar recordatorios si las notificaciones están habilitadas
    if (task.enableNotifications && isTaskActiveToday(task) && !isTaskCompletedThisMonth(task)) {
      // Para tareas no recurrentes, verificar si es del mes actual
      if (!task.isRecurring) {
        const taskCreatedDate = new Date(task.createdAt)
        const today = new Date()

        // Solo mostrar recordatorio si la tarea se creó en el mes actual
        if (taskCreatedDate.getMonth() !== today.getMonth() || taskCreatedDate.getFullYear() !== today.getFullYear()) {
          return
        }
      }

      remindersNeeded.push(`"${task.title}" debe completarse entre los días ${task.startDay} y ${task.endDay}`)
    }
  })

  return { remindersNeeded }
}
