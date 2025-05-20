'use client'
import { NavLinkProps } from '@/types/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react';

interface NavLinkComponentProps {
    navLinks: NavLinkProps[];
}


const NavLinks = ({ navLinks }: NavLinkComponentProps) => {
    const pathname = usePathname();


    return (
        <ul className='hidden md:flex items-center gap-6 '>
            {
                navLinks.map((link: NavLinkProps) => (
                    <li key={link.id}>
                        <Link
                            className={`opacity-75 hover:opacity-100
                                ${pathname === link.href && 'opacity-100'}
                                `}
                            href={link.href}>
                            {link.label}
                        </Link>
                    </li>

                ))
            }
        </ul>
    )
}

export default NavLinks