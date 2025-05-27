'use client'

import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React, { useRef } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { motion, useScroll, useTransform } from 'framer-motion'

import { usePathname, useSearchParams } from 'next/navigation'
import { heroMainData } from '@/constants/heromain'

const HomeMain = () => {
    const ref = useRef(null)
        ;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 0.6], [0, -400]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentUrl = `${pathname}?${searchParams.toString()}`

    const activeService = currentUrl.split('=')[1];
    const activeData = heroMainData.find(data => data.service === activeService)
    console.log(activeData)




    return (
        <motion.div
            ref={ref}
            style={{ y, scale }}
            className='bg-white mt-16 origin-bottom relative overflow-hidden  border-t backdrop-blur-2xl'
        >
            <WidthCard className='rounded-xl grid grid-cols-2 py-16 mb-8 min-h-[80vh] content-center '>
                <motion.div
                    className='col-span-1 text-dark space-y-8 flex flex-col items-center justify-center    w-full h-full mt-[25vh]'
                    style={{ y }}
                >
                    <h2>WE ARE A TEAM OF PROFESSIONAL</h2>
                    <h1 className='text-5xl'>{activeData?.tyeWriterText}</h1>
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
                    style={{ y: useTransform(scrollYProgress, [0, 0.6], [0, -100]), scale }}
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
