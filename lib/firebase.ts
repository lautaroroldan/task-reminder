"use client"

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBxOZsQ-Eu8UzaIjJOw7vy17saulDvsX4w",
    authDomain: "task-reminder-36129.firebaseapp.com",
    projectId: "task-reminder-36129",
    storageBucket: "task-reminder-36129.firebasestorage.app",
    messagingSenderId: "13879494291",
    appId: "1:13879494291:web:79fcaf9c8dad7e6620af66",
    measurementId: "G-3MB6RG48YG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const generateToken = async () => {

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });
            return token;
        }
        return null;
    } catch (error) {
        console.error("Error al generar el token:", error);
        return null;
    }
}

export { messaging, generateToken };