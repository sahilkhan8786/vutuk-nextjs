import { auth } from '@/auth'
import React from 'react'

const AdminDashboard = async () => {

    const session = await auth();

    return (
        <div className='  '>
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