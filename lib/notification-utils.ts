import type { NotificationFrequency } from "./types"

/**
 * Calcula si hoy es un día en que se debe enviar notificación
 * según la frecuencia configurada y la fecha de vencimiento de la tarea
 */
export function shouldNotifyToday(
  endDate: Date,
  frequency: NotificationFrequency,
  today: Date = new Date()
): boolean {
  // Normalizar fechas a medianoche para comparación
  const normalizedToday = new Date(today)
  normalizedToday.setHours(0, 0, 0, 0)

  const normalizedEndDate = new Date(endDate)
  normalizedEndDate.setHours(0, 0, 0, 0)

  const diffInMs = normalizedEndDate.getTime() - normalizedToday.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  switch (frequency) {
    case "daily":
      // Notificar todos los días hasta el vencimiento
      return diffInDays >= 0

    case "alternate":
      // Notificar días alternos (pares: 0, 2, 4, 6...)
      return diffInDays >= 0 && diffInDays % 2 === 0

    case "week_before":
      // Notificar solo si falta exactamente una semana
      return diffInDays === 7

    case "day_before":
      // Notificar solo el día anterior
      return diffInDays === 1

    default:
      return false
  }
}

/**
 * Obtiene todas las tareas que deben notificar hoy
 * filtrando por frecuencia y fecha
 */
export function filterTasksForNotification<T extends {
  endDate: Date
  frequency: NotificationFrequency
  notification: boolean
  completed: boolean
}>(tasks: T[], today: Date = new Date()): T[] {
  return tasks.filter(task => {
    // Solo tareas activas con notificaciones habilitadas
    if (!task.notification || task.completed) {
      return false
    }

    return shouldNotifyToday(task.endDate, task.frequency, today)
  })
}
