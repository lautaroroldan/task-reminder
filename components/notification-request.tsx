"use client"

import { generateToken, getFirebaseMessaging } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react'

function NotificationRequest({ setToken }: { setToken: (token: string) => void }) {

    useEffect(() => {
        generateToken().then((token) => {
            setToken(token || "");
        });
        
        const messaging = getFirebaseMessaging();
        if (messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log(payload);
            });
            return () => unsubscribe();
        }
    }, [setToken]);

    return null;
}

export default NotificationRequest