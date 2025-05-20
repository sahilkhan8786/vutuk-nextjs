'use client';
import React, { useEffect, useState } from 'react';
import { AlignRight, X } from 'lucide-react'
import { NavLinkProps } from '@/types/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
type NavLinksComponentProps = {
    navLinks: NavLinkProps[]
}

const HeaderMobile = ({ navLinks }: NavLinksComponentProps) => {
    const [isHamIconClicked, setIsHamIconClicked] = useState(false);
    const pathname = usePathname();


    function hamIconClickedHandler() {
        setIsHamIconClicked(prev => !prev)
    };
    function hideNav() {
        setIsHamIconClicked(false)
    };


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsHamIconClicked(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    return (
        <div className='flex md:hidden'>
            {!isHamIconClicked &&
                <AlignRight onClick={hamIconClickedHandler} />
            }
            {isHamIconClicked &&
                <X onClick={hamIconClickedHandler} />
            }

            {isHamIconClicked && <ul className='flex items-center gap-6 flex-col absolute left-0 top-[65px] bg-dark w-full border-t py-4'>
                {
                    navLinks.map((link: NavLinkProps) => (
                        <li key={link.id} className='w-full flex items-center justify-center '>
                            <Link
                                className={`opacity-75 hover:opacity-100
                                ${pathname === link.href && 'opacity-100 bg-light w-full text-dark flex items-center justify-center py-3'}
                                `}
                                href={link.href}
                                onClick={hideNav}
                            >
                                {link.label}
                            </Link>
                        </li>

                    ))
                }
            </ul>}
        </div>
    )
}

export default HeaderMobile