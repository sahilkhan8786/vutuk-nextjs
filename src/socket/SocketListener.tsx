'use client';
import { useEffect } from 'react';
import { io } from 'socket.io-client'

export default function SocketListener() {
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");


        socket.on('connect', () => {
            console.log("Connected to socket server", socket.id)
        })

        socket.on("notification", (msg) => {
            console.log("Notification:", msg);
            window.location.reload(); // 
        });

        return () => {
            socket.disconnect();
        };

    }, [])

    return null;
}