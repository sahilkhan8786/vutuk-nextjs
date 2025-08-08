"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SendNotification() {
    const session = useSession();
    const userId = session.data?.user.id
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    const handleSend = () => {
        if (socket && message.trim()) {
            socket.emit("send-notification-to-admin", {
                message: message,
                userId: userId,
            });
            setMessage("");
        }
    };

    return (
        <div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message"
            />
            <button onClick={handleSend}>Send Notification</button>
        </div>
    );
}
