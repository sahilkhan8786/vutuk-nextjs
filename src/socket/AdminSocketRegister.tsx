"use client";

import { io } from "socket.io-client";
import { useEffect } from "react";

export default function AdminSocketRegister({ role, id }: {
    role: string,
    id: string
}) {
    useEffect(() => {
        if (role === "admin") {
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
                socket.emit("register-admin", id);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [role, id]);

    return null;
}
