import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import { navLinks } from '@/constants/header'
import HeaderMobile from './HeaderMobile'
import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'

const Header = () => {
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

            </WidthCard>
        </header>
    )
}

export default Header