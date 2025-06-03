'use client'

import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React, { useRef } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { motion, } from 'framer-motion'

import useCurrentRoute from '@/hooks/useCurrentRoute'

const HomeMain = () => {
    const ref = useRef(null);

    const { activeData } = useCurrentRoute();

    return (
        <motion.div
            ref={ref}
            className='bg-white pt-64 origin-bottom relative overflow-hidden   backdrop-blur-2xl  flex items-center justify-center'
            initial={{
                y: -500,

            }}
            whileInView={{
                y: 0
            }}
        >
            <WidthCard className='rounded-xl grid grid-cols-2 py-16 mb-8  content-center '>
                <motion.div
                    className='col-span-1 text-dark space-y-8 flex flex-col items-center justify-center    w-full h-full '
                >
                    <h2>WE ARE A TEAM OF PROFESSIONAL</h2>
                    <h1 className='text-5xl'>{activeData?.typeWriterText}</h1>
                    <p>
                        {activeData?.description}
                    </p>
                    <div className='w-fit flex gap-6'>
                        <span className='flex items-center justify-center border border-dark rounded-full size-12 hover:scale-110 cursor-pointer transition-all'>
                            <FaPlay className='text-2xl ml-1' />
                        </span>
                        <button className='border border-dark px-4 py-2 rounded hover:bg-dark hover:text-white transition'>
                            Book a Call
                        </button>
                    </div>
                </motion.div>
                <motion.div
                    className='col-span-1 relative h-[600px]'

                >
                    {activeData?.image && <Image
                        src={activeData?.image}
                        alt={activeData?.service}
                        fill
                        className='object-contain'
                    />}
                </motion.div>
            </WidthCard>
        </motion.div>
    )
}

export default HomeMain
