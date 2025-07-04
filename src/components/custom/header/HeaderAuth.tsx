import { logout } from '@/actions/auth';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getInitials } from '@/utils/helpers';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const HeaderAuth = async () => {
    const session = await auth();


    const userIntials = !session?.user.image && getInitials(session?.user.name as string)


    return (
        <>
            {
                session && session.user && (
                    <>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {session.user.image ?
                                    <Image
                                        src={session.user.image}
                                        alt='user-avatar'
                                        width={40}
                                        height={40}
                                        className='rounded-full cursor-pointer'
                                    />
                                    :
                                    <div className='rounded-full bg-light text-dark size-8 flex items-center justify-center font-medium cursor-pointer'>{userIntials}</div>
                                }

                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='mr-4 w-24'>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer'>
                                    <Link href={'/dashboard/profile'}>
                                        Profile

                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                    <Link href={'/dashboard/orders'}>
                                        Orders

                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                    <Link href={'/dashboard/favourites'}>
                                        Favourites
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <form action={logout}>
                                        <Button type='submit'>Logout</Button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>



                    </>
                )
            }

            {
                !session &&
                <Link href={'/log-in'}>
                    Login
                </Link>
            }
        </>
    )
}

export default HeaderAuth