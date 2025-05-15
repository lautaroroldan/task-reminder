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
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});