import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectTask, tasksTable } from '../schema';

export async function getTaskById(id: SelectTask['id']): Promise<SelectTask[]> {
    return db.select().from(tasksTable).where(eq(tasksTable.id, id));
}

export async function getAllTasks(): Promise<SelectTask[]> {
    return db.select().from(tasksTable);
}

