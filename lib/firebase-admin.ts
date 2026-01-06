import admin from 'firebase-admin';

const getAdminApp = () => {
    if (!admin.apps.length) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error(
                'Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.'
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });
    }
    return admin;
};

export const sendNotification = async (
    token: string,
    payload: { title: string; body: string; taskId: string }
) => {
    const app = getAdminApp();
    await app.messaging().send({
        token,
        data: {
            title: payload.title,
            body: payload.body,
            taskId: payload.taskId,
        },
    });
};

export const sendGroupedNotification = async (
    token: string,
    payload: {
        count: number;
        tasks: Array<{
            id: string;
            title: string;
            daysUntilDue: number;
        }>;
    }
) => {
    const app = getAdminApp();
    
    // Crear el cuerpo de la notificación con la lista de tareas
    const taskList = payload.tasks
        .map(task => {
            let timeText = '';
            if (task.daysUntilDue === 0) {
                timeText = 'vence hoy';
            } else if (task.daysUntilDue === 1) {
                timeText = 'vence mañana';
            } else if (task.daysUntilDue === 7) {
                timeText = 'vence en 1 semana';
            } else {
                timeText = `vence en ${task.daysUntilDue} días`;
            }
            return `• ${task.title} (${timeText})`;
        })
        .join('\n');
    
    await app.messaging().send({
        token,
        data: {
            title: `📋 ${payload.count} tarea${payload.count > 1 ? 's' : ''} pendiente${payload.count > 1 ? 's' : ''}`,
            body: taskList,
            count: payload.count.toString(),
            taskIds: JSON.stringify(payload.tasks.map(t => t.id)),
            type: 'grouped',
        },
    });
};
