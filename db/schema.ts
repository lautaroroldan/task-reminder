import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import type { NotificationFrequency } from "@/lib/types"

export const tasksTable = pgTable('tasks', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    completed: boolean('completed').default(false).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    recurring: boolean('recurring').default(false).notNull(),
    notification: boolean('notification').default(false).notNull(),
    token: text('token').notNull(),
    user: text('user'),
    frequency: text('frequency').default('daily').notNull().$type<NotificationFrequency>(),
    color: text('color').default('#FFC0CB').notNull(),
})

export type InsertTask = typeof tasksTable.$inferInsert
export type SelectTask = typeof tasksTable.$inferSelect