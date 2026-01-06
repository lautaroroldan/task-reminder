/**
 * Calcula cuántos días faltan desde hoy hasta una fecha objetivo.
 * Ignora completamente las horas, solo compara días.
 * 
 * @param targetDate - Fecha objetivo
 * @param fromDate - Fecha desde la cual calcular (por defecto hoy)
 * @returns Número de días. 0 = mismo día, negativo = pasado, positivo = futuro
 */
export function getDaysUntilDate(targetDate: Date, fromDate: Date = new Date()): number {
  // Normalizar ambas fechas a medianoche para comparar solo días
  const normalizedFrom = new Date(fromDate)
  normalizedFrom.setHours(0, 0, 0, 0)
  
  const normalizedTarget = new Date(targetDate)
  normalizedTarget.setHours(0, 0, 0, 0)
  
  // Calcular diferencia en milisegundos
  const diffInMs = normalizedTarget.getTime() - normalizedFrom.getTime()
  
  // Convertir a días (usar Math.round para evitar problemas de redondeo)
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))
  
  return diffInDays
}

/**
 * Formatea cuántos días faltan para una fecha en texto amigable en español
 * 
 * @param daysUntilDue - Número de días hasta el vencimiento
 * @returns Texto formateado ("vence hoy", "vence mañana", etc.)
 */
export function formatDaysUntilText(daysUntilDue: number): string {
  if (daysUntilDue < 0) {
    return `venció hace ${Math.abs(daysUntilDue)} día${Math.abs(daysUntilDue) > 1 ? 's' : ''}`
  } else if (daysUntilDue === 0) {
    return 'vence hoy'
  } else if (daysUntilDue === 1) {
    return 'vence mañana'
  } else if (daysUntilDue === 7) {
    return 'vence en 1 semana'
  } else if (daysUntilDue === 14) {
    return 'vence en 2 semanas'
  } else {
    return `vence en ${daysUntilDue} día${daysUntilDue > 1 ? 's' : ''}`
  }
}
