"use server"

import { createTask } from "@/db/queries/insert"
import { getAllTasks } from "@/db/queries/select"
import type { Task } from "@/lib/types"

export async function saveTask(task: Task) {
    try {
        const startDate = new Date()
        startDate.setDate(task.startDay)

        const endDate = new Date()
        endDate.setDate(task.endDay)

        await createTask({
            title: task.title,
            startDate,
            endDate,
            recurring: task.isRecurring,
            notification: task.enableNotifications,
            token: task.token,
            completed: false
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
            id: dbTask.id.toString(),
            title: dbTask.title || "",
            startDay: new Date(dbTask.startDate).getDate(),
            endDay: new Date(dbTask.endDate).getDate(),
            createdAt: dbTask.createdAt?.toISOString() || new Date().toISOString(),
            completions: [], // TODO: Implementar tabla de completions
            isRecurring: dbTask.recurring || false,
            enableNotifications: dbTask.notification || false,
            token: dbTask.token || ""
        }))
    } catch (error) {
        console.error("Error al obtener las tareas:", error)
        return []
    }
} 