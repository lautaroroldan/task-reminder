import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectTask, tasksTable } from '../schema';

export async function updateTask(id: SelectTask['id'], data: Partial<Omit<SelectTask, 'id'>>) {
    await db.update(tasksTable).set(data).where(eq(tasksTable.id, id));
}
