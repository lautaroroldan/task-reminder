export interface TaskCompletion {
  month: number
  year: number
}

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
}
