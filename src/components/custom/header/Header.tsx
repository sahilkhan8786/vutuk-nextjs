'use client'
import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import { navLinks } from '@/constants/header'
import HeaderMobile from './HeaderMobile'
import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCart } from '@/context/cart-context'

const Header = () => {

    const { state } = useCart();



    return (
        <header className='w-full bg-dark text-light fixed top-0 left-0 z-50'>
            <WidthCard className=' flex items-center justify-between px-4 py-4 h-[65px]'>

                <div>
                    <Link href={'/'}                    >
                        <div className='relative h-[60px] w-[120px]'>

                            <Image
                                fill
                                src={'/main-logo-white.png'}
                                alt='logo'
                                className='absolute top-0 left-0'
                            />
                        </div>
                    </Link>
                </div>

                <nav>
                    {/* DESKTOP-NAVIGATION */}
                    <NavLinks navLinks={navLinks} />


                    <HeaderMobile navLinks={navLinks} />

                    {/* MOBILE NAVIGATION */}
                </nav>
                <nav className='flex items-center justify-end gap-4'>
                    <Link href={'/cart'} className='relative '>

                        <ShoppingCart className='border rounded-sm p-1 hover:bg-light hover:text-dark' />
                        <p className='absolute -top-3 -right-3 bg-light text-dark rounded-full size-5 inline-flex items-center justify-center'> {state.totalItem}

                        </p>
                    </Link>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                </nav>

            </WidthCard>
        </header>
    )
}

export default Header