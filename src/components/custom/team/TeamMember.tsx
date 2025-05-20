import Image from 'next/image'
import React from 'react'
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa'
import { SiFreelancer } from "react-icons/si"

interface TeamMemberProps {
    className?: string
    name: string
    role: string
}

const TeamMember: React.FC<TeamMemberProps> = ({ className = '', name, role }) => {
    return (
        <div className={`${className} flex flex-col items-center`}>
            <div className="relative w-full h-full group overflow-hidden">
                {/* Image */}
                <Image
                    src={'/team-member-1.png'}
                    fill
                    className='object-cover absolute top-0 left-0 object-top grayscale group-hover:grayscale-0 transition-all duration-500'
                    alt={name}
                />

                {/* Overlay with icons */}
                <div className="absolute bottom-[-100px] left-0 w-full flex justify-center gap-4 py-4 bg-black/40 transition-all duration-500 group-hover:bottom-0">
                    <a href="#" className="text-white hover:text-pink-500">
                        <FaInstagram />
                    </a>
                    <a href="#" className="text-white hover:text-blue-600">
                        <FaFacebookF />
                    </a>
                    <a href="#" className="text-white hover:text-sky-400">
                        <FaTwitter />
                    </a>
                    <a href="#" className="text-white hover:text-purple-400">
                        <SiFreelancer />
                    </a>
                </div>
            </div>

            {/* Name and Role */}
            <div className="mt-3 text-center">
                <h4 className="font-semibold text-lg">{name}</h4>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    )
}

export default TeamMember
