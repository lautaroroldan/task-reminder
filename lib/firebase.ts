"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, type Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBxOZsQ-Eu8UzaIjJOw7vy17saulDvsX4w",
    authDomain: "task-reminder-36129.firebaseapp.com",
    projectId: "task-reminder-36129",
    storageBucket: "task-reminder-36129.firebasestorage.app",
    messagingSenderId: "13879494291",
    appId: "1:13879494291:web:79fcaf9c8dad7e6620af66",
    measurementId: "G-3MB6RG48YG"
};

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

const getFirebaseApp = () => {
    if (typeof window === "undefined") return undefined;
    if (!app && !getApps().length) {
        app = initializeApp(firebaseConfig);
    }
    return app || getApps()[0];
};

const getFirebaseMessaging = () => {
    if (typeof window === "undefined") return undefined;
    if (!messaging) {
        const firebaseApp = getFirebaseApp();
        if (firebaseApp) {
            messaging = getMessaging(firebaseApp);
        }
    }
    return messaging;
};

const generateToken = async () => {
    if (typeof window === "undefined") return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const msg = getFirebaseMessaging();
            if (!msg) return null;

            const token = await getToken(msg, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });
            return token;
        }
        return null;
    } catch (error) {
        console.error("Error al generar el token:", error);
        return null;
    }
};

export { getFirebaseMessaging, generateToken };