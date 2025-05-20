import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React from 'react'
import { HiMiniVideoCamera, HiTrophy, HiUsers } from 'react-icons/hi2'

const AboutHero = () => {
    return (
        <WidthCard>
            <div className='grid grid-cols-3'>

                <Image
                    src={'/about-img.png'}
                    alt='About Image'
                    width={600}
                    height={400}
                />

                <div className='col-span-2 mt-16'>
                    <h1 className='font-bebas text-6xl mb-6'>Achievements</h1>
                    <p>Vutuk: Where Engineering Meets Creativity. With a dynamic team of skilled engineers and visionary video editors, we&apos;ve garnered a proven track record of delivering exceptional digital solutions. Our client-focused approach has led to a diverse portfolio of successful collaborations, spanning industries and igniting digital experiences that leave a lasting impact. At Vutuk, we don&apos;t just achieve — we elevate visions to reality.</p>

                    <div className='flex items-center justify-between gap-6 '>
                        <div className='flex flex-col gap-4 my-4 bg-white flex-1 rounded-xl items-center py-6'>
                            <HiMiniVideoCamera className='bg-light text-5xl p-2 rounded-xl shadow shadow-dark' />
                            <h3>2000+</h3>
                            <p>Projects</p>
                        </div>
                        <div className='flex flex-col gap-4 my-4 bg-white flex-1 rounded-xl items-center py-6'>
                            <HiUsers className='bg-light text-5xl p-2 rounded-xl shadow shadow-dark' />
                            <h3>2000+</h3>
                            <p>Projects</p>
                        </div>
                        <div className='flex flex-col gap-4 my-4 bg-white flex-1 rounded-xl items-center py-6'>
                            <HiTrophy className='bg-light text-5xl p-2 rounded-xl shadow shadow-dark' />
                            <h3>2000+</h3>
                            <p>Projects</p>
                        </div>
                    </div>
                </div>
            </div>
        </WidthCard>
    )
}

export default AboutHero