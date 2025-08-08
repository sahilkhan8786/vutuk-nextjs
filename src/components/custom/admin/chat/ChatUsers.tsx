import { User } from '@/app/(admin)/admin/users/columns'
import { getInitials } from '@/utils/helpers'
import Image from 'next/image'
import React from 'react'

const ChatUsers = ({ users }: {
    users: User[]
}) => {


    return (
        <ul className=' p-4 bg-primary flex gap-4 place-content-center w-full overflow-x-auto'>
            {users.map(user => {
                const userIntials = !user.image && getInitials(user.name as string)
                return (
                    <li key={user._id} className='flex flex-col items-center justify-center bg-secondary text-primary rounded-full size-[120px] hover:-translate-y-1 hover:shadow-secondary shadow-sm  transition-all hover:scale-110 cursor-pointer'>
                        {user.image ?
                            <Image
                                src={user.image || ''}
                                alt={user.name}
                                width={50}
                                height={50}
                            /> :
                            <div className='rounded-full bg-light text-dark size-[50px] flex items-center justify-center font-medium cursor-pointer'>{userIntials}</div>

                        }

                        {user.name}
                    </li>
                )
            })
            }


        </ul>
    )
}

export default ChatUsers