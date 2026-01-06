"use server"

import { createTask } from "@/db/queries/insert"
import { getAllTasks } from "@/db/queries/select"
import type { Task } from "@/lib/types"

export async function saveTask(task: Task) {
    try {
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()

        const startDate = new Date(currentYear, currentMonth, task.startDay)
        // Si no se especifica endDay o es 0, usar startDay
        const endDay = task.endDay || task.startDay
        const endDate = new Date(currentYear, currentMonth, endDay)

        await createTask({
            title: task.title,
            startDate,
            endDate,
            recurring: task.isRecurring,
            notification: task.enableNotifications,
            token: task.token,
            completed: false,
            user: task.user || null,
            frequency: task.frequency,
            color: task.color,
        })
        
        return { success: true }
    } catch (error) {
        console.error("Error al guardar la tarea:", error)
        return { success: false, error: "Error al guardar la tarea" }
    }
}

export async function getTasks(): Promise<Task[]> {
    try {
        const dbTasks = await getAllTasks()

        // Convertir el formato de la base de datos al formato de la aplicación
        return dbTasks.map(dbTask => ({
            id: dbTask.id,
            title: dbTask.title || "",
            startDay: new Date(dbTask.startDate).getDate(),
            endDay: new Date(dbTask.endDate).getDate(),
            createdAt: dbTask.createdAt?.toISOString() || new Date().toISOString(),
            completions: [], // TODO: Implementar tabla de completions
            isRecurring: dbTask.recurring || false,
            enableNotifications: dbTask.notification || false,
            token: dbTask.token || "",
            user: dbTask.user || undefined,
            frequency: (dbTask.frequency as Task["frequency"]) || "daily",
            color: dbTask.color || "#FFC0CB"
        }))
    } catch (error) {
        console.error("Error al obtener las tareas:", error)
        return []
    }
}