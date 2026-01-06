import { db } from '../index'
import type { InsertTask } from '../schema'
import { tasksTable } from '../schema'

export async function createTask(data: Omit<InsertTask, 'id' | 'createdAt' | 'updatedAt'>) {
    await db.insert(tasksTable).values(data)
}
