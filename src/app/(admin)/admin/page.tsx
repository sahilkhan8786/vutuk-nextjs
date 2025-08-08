import { auth } from '@/auth'
import AdminSocketRegister from '@/socket/AdminSocketRegister';
import React from 'react'

const AdminDashboard = async () => {

    const session = await auth();

    const role = session && session.user?.role;
    const id = session && session.user?.id;
    console.log(role)

    return (
        <div className='  '>
            <AdminSocketRegister role={role as string}
                id={id as string}
            />
            AdminDashboard
            <div>
                {
                    JSON.stringify(session, null, 2)
                }
            </div>
        </div>
    )
}

export default AdminDashboard