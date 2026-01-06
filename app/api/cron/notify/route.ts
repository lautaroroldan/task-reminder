import { getTasksForNotification } from '@/db/queries/select';
import { sendGroupedNotification } from '@/lib/firebase-admin';
import { filterTasksForNotification } from '@/lib/notification-utils';
import { getDaysUntilDate } from '@/lib/date-utils';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const allTasks = await getTasksForNotification();

        // Filtrar tareas según su frecuencia de notificación
        const tasksToNotify = filterTasksForNotification(allTasks);

        if (tasksToNotify.length === 0) {
            return NextResponse.json({
                success: true,
                found: allTasks.length,
                sent: 0,
                notifications: []
            });
        }

        // Agrupar tareas por token (para soportar múltiples usuarios en el futuro)
        const tasksByToken = new Map<string, typeof tasksToNotify>();
        
        for (const task of tasksToNotify) {
            if (task.token) {
                if (!tasksByToken.has(task.token)) {
                    tasksByToken.set(task.token, []);
                }
                tasksByToken.get(task.token)!.push(task);
            }
        }

        let sentCount = 0;
        const notifications = [];

        // Enviar una notificación agrupada por cada token (usuario)
        for (const [token, tasks] of tasksByToken.entries()) {
            const tasksData = tasks.map(task => {
                // Usar la nueva utilidad que solo compara días (ignora horas)
                const diffInDays = getDaysUntilDate(task.endDate);
                
                return {
                    id: task.id,
                    title: task.title,
                    daysUntilDue: diffInDays
                };
            });

            // Ordenar por urgencia (menos días primero)
            tasksData.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

            await sendGroupedNotification(token, {
                count: tasks.length,
                tasks: tasksData
            });

            notifications.push({
                token: token.substring(0, 10) + '...',
                taskCount: tasks.length,
                tasks: tasksData.map(t => ({
                    title: t.title,
                    daysUntilDue: t.daysUntilDue
                }))
            });

            sentCount++;
        }

        return NextResponse.json({
            success: true,
            found: allTasks.length,
            sent: sentCount,
            totalTasks: tasksToNotify.length,
            notifications
        });
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}