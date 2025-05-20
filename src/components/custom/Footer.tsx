import React from 'react'
import WidthCard from '../ui/WidthCard'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebookF } from 'react-icons/fa'


const Footer = () => {
    return (
        <footer className='bg-dark'>
            <WidthCard className='px-2 py-16 grid grid-cols-4 '>
                <div>
                    <Image src={'/main-logo-white.png'}
                        alt='Vutuk Logo'
                        width={250}
                        height={45}
                    />
                    <p className='text-white  mt-4'>Your Vision Our Execution</p>
                </div>
                <div className='flex flex-col text-white space-y-2'>
                    <h2 className='font-semibold text-xl'>Pages</h2>
                    <Link className='opacity-80 hover:opacity-100' href={'/'}>Home</Link>
                    <Link className='opacity-80 hover:opacity-100' href={'/about-us'}>About Us</Link>
                    <Link className='opacity-80 hover:opacity-100' href={'/projects'}>Projects</Link>
                    <Link className='opacity-80 hover:opacity-100' href={'/contact-us'}>Contact Us</Link>
                </div>
                <div className='flex flex-col text-white space-y-2'>
                    <h2 className='font-semibold text-xl'>Other Links</h2>
                    <Link className='opacity-80 hover:opacity-100' href={'/'}>Vutuk Media</Link>
                    <Link className='opacity-80 hover:opacity-100' href={'/'}>Vutuk Design</Link>
                    <Link className='opacity-80 hover:opacity-100' href={'/'}>Vutuk Web Development</Link>

                </div>
                <div className='flex flex-col text-white space-y-2'>
                    <h2 className='font-semibold text-xl'>Contact Us</h2>

                    {/* Email */}
                    <a
                        href="mailto:contact@vutuk.com"
                        className="opacity-80 hover:opacity-100 underline"
                    >
                        contact@vutuk.com
                    </a>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-2">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                            <FaInstagram />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
                            <FaTwitter />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                            <FaFacebookF />
                        </a>
                    </div>
                </div>

            </WidthCard>
            <p className="text-sm text-light text-center pb-6 border-t pt-4 mt-4">
                © {new Date().getFullYear()} Vutuk Media. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer