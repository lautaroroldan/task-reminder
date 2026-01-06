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
                console.log('[Foreground] Notificación recibida:', payload);
                
                // Mostrar notificación cuando la app está en foreground
                if (payload.data && Notification.permission === 'granted') {
                    const title = payload.data.title || 'Nueva notificación';
                    const body = payload.data.body || '';
                    
                    new Notification(title, {
                        body: body,
                        icon: '/next.svg',
                        badge: '/next.svg',
                        tag: payload.data.type === 'grouped' 
                            ? `daily-summary-${new Date().toISOString().split('T')[0]}`
                            : `task-${payload.data.taskId}`,
                    });
                }
            });
            return () => unsubscribe();
        }
    }, [setToken]);

    return null;
}

export default NotificationRequest