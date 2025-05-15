import { getTasks } from '@/app/actions/tasks';
import { sendNotification } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tasks = await getTasks(); // tareas que aún no terminaron o están sin completar
        console.log(tasks)
        for (const task of tasks) {
            if (task.token) {
                await sendNotification(task.token, {
                    title: 'Recordatorio diario',
                    body: `Tarea pendiente: ${task.title}`,
                });
            }
        }

        return NextResponse.json({ success: true, sent: tasks.length });
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}