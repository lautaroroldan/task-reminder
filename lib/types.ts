export interface TaskCompletion {
  month: number
  year: number
}

export type NotificationFrequency = 
  | "daily" 
  | "alternate" 
  | "week_before" 
  | "day_before"

export interface Task {
  id: string
  title: string
  startDay: number
  endDay: number
  createdAt: string
  completions: TaskCompletion[]
  isRecurring: boolean
  enableNotifications: boolean
  token: string
  user?: string
  frequency: NotificationFrequency
  color: string
}
