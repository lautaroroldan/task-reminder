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
    const type = payload.data.type;
    
    // Configuración base de la notificación
    const notificationOptions = {
        body: notificationBody,
        icon: '/next.svg',
        badge: '/next.svg',
        requireInteraction: false,
        vibrate: [200, 100, 200],
    };

    // Si es una notificación agrupada
    if (type === 'grouped') {
        const count = parseInt(payload.data.count, 10);
        const taskIds = JSON.parse(payload.data.taskIds);
        const today = new Date().toISOString().split('T')[0];
        
        notificationOptions.tag = `daily-summary-${today}`;
        notificationOptions.badge = count.toString();
        notificationOptions.renotify = true;
        
        // Agregar acciones para notificaciones agrupadas
        notificationOptions.actions = [
            { action: 'view-all', title: '👁️ Ver todas' },
            { action: 'dismiss', title: '✖️ Cerrar' }
        ];
        
        // Agregar data para el click handler
        notificationOptions.data = {
            type: 'grouped',
            taskIds: taskIds,
            count: count
        };
    } else {
        // Notificación individual (legacy, por si acaso)
        const taskId = payload.data.taskId;
        notificationOptions.tag = `task-${taskId}`;
        notificationOptions.data = {
            type: 'single',
            taskId: taskId
        };
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Event listener para manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const action = event.action;
    const notificationData = event.notification.data;
    
    if (notificationData.type === 'grouped') {
        // Notificación agrupada
        if (action === 'view-all' || !action) {
            // Abrir la app principal
            event.waitUntil(
                clients.openWindow('/')
            );
        }
        // Si es 'dismiss', solo cierra la notificación (ya está cerrada arriba)
    } else if (notificationData.type === 'single') {
        // Notificación individual (legacy)
        const taskId = notificationData.taskId;
        
        if (action === 'view' || !action) {
            // Abrir la app
            event.waitUntil(
                clients.openWindow('/')
            );
        }
        // TODO: Implementar acción de completar cuando tengas el endpoint
        // else if (action === 'complete') {
        //     event.waitUntil(
        //         fetch('/api/tasks/complete', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ taskId })
        //         })
        //     );
        // }
    }
});