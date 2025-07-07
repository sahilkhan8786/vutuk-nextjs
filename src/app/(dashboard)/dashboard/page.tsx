import { auth } from '@/auth'
import React from 'react'

const UserDashboardPage = async () => {
    const session = await auth()
    return (
        <div>UserDashboardPage
            <div>
                {
                    JSON.stringify(session, null, 2)
                }
            </div>

        </div>
    )
}

export default UserDashboardPage