import { getTasksExpiringTomorrow } from '@/db/queries/select';
import { sendNotification } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tasks = await getTasksExpiringTomorrow();
        
        let sentCount = 0;
        for (const task of tasks) {
            if (task.token) {
                await sendNotification(task.token, {
                    title: 'Tarea por vencer',
                    body: `"${task.title}" vence mañana`,
                });
                sentCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            found: tasks.length,
            sent: sentCount 
        });
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}