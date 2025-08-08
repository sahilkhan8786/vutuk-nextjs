import ChatUsers from '@/components/custom/admin/chat/ChatUsers';
import { headers } from 'next/headers';
import React from 'react'

async function getUsers() {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        headers: {

            cookie: cookieHeader
        }
    })
    const json = await res.json();

    return json.data.users;

}


const AdminChatsPage = async () => {

    const users = await getUsers();

    console.log(users);
    return (
        <>
            <ChatUsers users={users} />
            <div>AdminChatsPage</div>

        </>

    )
}

export default AdminChatsPage