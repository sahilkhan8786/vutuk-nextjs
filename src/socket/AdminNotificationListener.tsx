"use client";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function AdminSocketRegister() {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const id = session?.user?.id;

    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        if (role === "admin" && id) {
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
                socket.emit("register-admin", id);
            });

            // Listen for notifications
            socket.on("notification", (data) => {
                console.log(data)
                console.log("📩 Notification received:", data.message);
                setNotifications(prev => [data, ...prev]);

            });

            return () => {
                socket.disconnect();
            };
        }
    }, [role, id]);

    if (role !== "admin") return null;

    return (
        <div className="p-4 bg-gray-100 rounded-md shadow-md mt-4">
            <h2 className="font-bold mb-2">Admin Notifications</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet</p>
            ) : (
                <ul className="space-y-1">
                    {notifications.map((n, index) => (
                        <li key={index} className="bg-white p-2 rounded shadow-sm">
                            {n}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
