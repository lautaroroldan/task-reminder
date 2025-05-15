import { generateToken, messaging } from '@/lib/firebase';
import { onMessage } from 'firebase/messaging';
import React, { useEffect } from 'react'

function NotificationRequest({ setToken }: { setToken: (token: string) => void }) {

    useEffect(() => {
        generateToken().then((token) => {
            setToken(token || "");
        });
        onMessage(messaging, (payload) => {
            console.log(payload)
        })
    }, []);

    return (
        <></>
    )
}

export default NotificationRequest