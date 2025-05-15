import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectTask, tasksTable } from '../schema';

export async function deleteTask(id: SelectTask['id']) {
    await db.delete(tasksTable).where(eq(tasksTable.id, id));
}
