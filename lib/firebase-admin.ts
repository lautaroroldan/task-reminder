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
