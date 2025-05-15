import { db } from '../index';
import { InsertTask, tasksTable } from '../schema';

export async function createTask(data: InsertTask) {
    await db.insert(tasksTable).values(data);
}
