import { logout } from '@/actions/auth';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { authHeaderAdminLinks, authHeaderUserLinks } from '@/constants/headerAuth';
import { getInitials } from '@/utils/helpers';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import AuthFormWrapper from '../auth/AuthFormWrapper';

const HeaderAuth = async () => {
    const session = await auth();
    const isAdmin = session?.user.role === 'admin';
    const links = isAdmin ? authHeaderAdminLinks : authHeaderUserLinks


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

                                {links.map(link => (

                                    <DropdownMenuItem key={link.link} className='cursor-pointer'>
                                        <Link href={link.href}>
                                            {link.link}

                                        </Link>
                                    </DropdownMenuItem>
                                ))}

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
                <AuthFormWrapper trigger={
                    <Button>Login</Button>
                } />

            }
        </>
    )
}

export default HeaderAuth