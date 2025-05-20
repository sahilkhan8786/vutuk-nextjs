'use client'
import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6';
import { SiGmail } from "react-icons/si";

const countries = [
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
]

const ContactUsPage = () => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0])

    return (
        <WidthCard className='bg-white rounded-xl p-6 grid grid-cols-2 gap-6 h-[550px]  relative my-16'>

            <div className='grid-cols-1'></div>
            <div className='bg-light border-r rounded-xl absolute -top-[25px] left-[10%] w-1/3 shadow-dark shadow h-[600px]'>
                <div className='relative  h-[350px]'>
                    <Image
                        src={'/contact-image.png'}
                        alt='Contact image'
                        fill
                        className='absolute top-0 left-0 object-contain'
                    />
                </div>
                <div className='flex items-center  flex-col my-6'>
                    <h1 className='font-bebas text-4xl text-center'>Get In Touch</h1>
                    <SiGmail className='text-6xl text-dark text-center' />
                    <p>contact@vutuk.com</p>
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
            </div>
            <div className='flex flex-col items-start justify-center'>
                <form className='w-full max-w-xl space-y-4' onSubmit={(e) => e.preventDefault()}>
                    {/* Name fields */}
                    <div className='flex gap-4'>
                        <input
                            type="text"
                            placeholder='First Name'
                            className='w-1/2 border border-gray-300 rounded p-2'
                            required
                        />
                        <input
                            type="text"
                            placeholder='Last Name'
                            className='w-1/2 border border-gray-300 rounded p-2'
                            required
                        />
                    </div>

                    {/* Email */}
                    <input
                        type="email"
                        placeholder='Enter your Email Address'
                        className='w-full border border-gray-300 rounded p-2'
                        required
                    />

                    {/* Phone with country code */}
                    <div className='flex gap-2'>
                        <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                                const code = e.target.value
                                const country = countries.find(c => c.code === code)
                                if (country) setSelectedCountry(country)
                            }}
                            className='border border-gray-300 rounded p-2'
                        >
                            {countries.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            placeholder='Phone Number'
                            className='flex-1 border border-gray-300 rounded p-2'
                            required
                        />
                    </div>

                    {/* Message */}
                    <textarea
                        placeholder='Enter your Message'
                        rows={4}
                        className='w-full border border-gray-300 rounded p-2'
                        required
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        className='bg-dark text-white px-6 py-2 rounded hover:bg-light hover:border-dark hover:text-dark cursor-pointer border transition'
                    >
                        Submit
                    </button>
                </form>
            </div>
        </WidthCard>
    )
}

export default ContactUsPage
