import { getTasksForNotification } from '@/db/queries/select';
import { sendNotification } from '@/lib/firebase-admin';
import { filterTasksForNotification } from '@/lib/notification-utils';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const allTasks = await getTasksForNotification();

        // Filtrar tareas según su frecuencia de notificación
        const tasksToNotify = filterTasksForNotification(allTasks);

        let sentCount = 0;
        const notifications = [];

        for (const task of tasksToNotify) {
            if (task.token) {
                const diffInDays = Math.ceil(
                    (new Date(task.endDate).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
                );
                
                let body = '';
                if (diffInDays === 0) {
                    body = `"${task.title}" vence hoy`;
                } else if (diffInDays === 1) {
                    body = `"${task.title}" vence mañana`;
                } else if (diffInDays === 7) {
                    body = `"${task.title}" vence en una semana`;
                } else {
                    body = `"${task.title}" vence en ${diffInDays} días`;
                }
                
                await sendNotification(task.token, {
                    title: 'Recordatorio de tarea',
                    body,
                    taskId: task.id,
                });
                
                notifications.push({
                    title: task.title,
                    frequency: task.frequency,
                    daysUntilDue: diffInDays
                });
                
                sentCount++;
            }
        }

        return NextResponse.json({
            success: true,
            found: allTasks.length,
            sent: sentCount,
            notifications
        });
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}