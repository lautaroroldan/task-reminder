import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const tasksTable = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    completed: boolean('completed').default(false),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    recurring: boolean('recurring').default(false),
    notification: boolean('notification').default(false),
    token: text('token').notNull(),
});

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;