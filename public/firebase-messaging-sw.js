importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBxOZsQ-Eu8UzaIjJOw7vy17saulDvsX4w",
    authDomain: "task-reminder-36129.firebaseapp.com",
    projectId: "task-reminder-36129",
    storageBucket: "task-reminder-36129.firebasestorage.app",
    messagingSenderId: "13879494291",
    appId: "1:13879494291:web:79fcaf9c8dad7e6620af66",
    measurementId: "G-3MB6RG48YG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    
    // Extraer datos del payload
    const notificationTitle = payload.data.title;
    const notificationBody = payload.data.body;
    const taskId = payload.data.taskId;
    
    const notificationOptions = {
        body: notificationBody,
        icon: '/next.svg',
        badge: '/next.svg',
        tag: `task-${taskId}`, // Tag único: evita notificaciones duplicadas para la misma tarea
        requireInteraction: false,
        // TODO: Descomentar cuando implementes los endpoints de acciones
        // actions: [
        //     { action: 'view', title: 'Ver tarea', icon: '/next.svg' },
        //     { action: 'complete', title: 'Completar', icon: '/next.svg' },
        //     { action: 'dismiss', title: 'Cerrar', icon: '/next.svg' }
        // ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// TODO: Event listener para manejar clicks en las acciones
// self.addEventListener('notificationclick', (event) => {
//     event.notification.close();
//     
//     const action = event.action;
//     const taskId = event.notification.tag.replace('task-', '');
//     
//     if (action === 'complete') {
//         // Llamar a endpoint para marcar tarea como completa
//         event.waitUntil(
//             fetch('/api/tasks/complete', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ taskId })
//             })
//         );
//     } else if (action === 'view') {
//         // Abrir la app en la tarea específica
//         event.waitUntil(
//             clients.openWindow(`/?taskId=${taskId}`)
//         );
//     }
//     // Si es 'dismiss' o click sin acción, solo cierra la notificación
// });