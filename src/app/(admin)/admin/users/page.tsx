
import { headers } from 'next/headers'

import React from 'react'
import { DataTable } from './data-table';
import { columns, User } from './columns';


async function getData(): Promise<User[]> {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") ?? '';

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        headers: {
            cookie: cookieHeader
        }
    });

    const json = await res.json()

    return json.data.users as User[];


}

const AdminUsersPage = async () => {

    const data = await getData()

    return (
        <div >
            <h1 className='bg-white p-4 rounded-xl text-4xl font-medium mb-4 '>Users</h1>


            <div className="w-full mt-4">
                <DataTable columns={columns} data={data} />

            </div>

        </div>
    )
}

export default AdminUsersPage