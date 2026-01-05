import { eq, and, gte, lt } from 'drizzle-orm';
import { db } from '../index';
import { SelectTask, tasksTable } from '../schema';

export async function getTaskById(id: SelectTask['id']): Promise<SelectTask[]> {
    return db.select().from(tasksTable).where(eq(tasksTable.id, id));
}

export async function getAllTasks(): Promise<SelectTask[]> {
    return db.select().from(tasksTable);
}

export async function getTasksExpiringTomorrow(): Promise<SelectTask[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return db
        .select()
        .from(tasksTable)
        .where(
            and(
                eq(tasksTable.completed, false),
                eq(tasksTable.notification, true),
                gte(tasksTable.endDate, tomorrow),
                lt(tasksTable.endDate, dayAfterTomorrow)
            )
        );
}

