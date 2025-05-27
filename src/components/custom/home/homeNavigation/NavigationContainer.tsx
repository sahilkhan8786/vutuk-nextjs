'use client'

import WidthCard from '@/components/ui/WidthCard'
import React, { useRef, useState } from 'react'
import NavigationCard from './NavigationCard'
import { homeNavigation } from '@/constants/HomeNavigationContainer'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion';
const NavigationContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null)
    const router = useRouter()

    const handleClick = (id: string) => {
        router.push(`?service=${id}`)
    }

    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'], // When top of target hits bottom of viewport to when bottom hits top
    })

    const y = useTransform(scrollYProgress, [0, 0.5], [0, 500]);
    const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.6]);

    return (
        <motion.div
            ref={ref}
            className='space-y-16 bg-white z-20'
            style={{ y, scale }}
        >
            <WidthCard className='flex justify-between items-center rounded-xl overflow-hidden min-h-screen mb-6'>
                {homeNavigation.map((data) => (
                    <NavigationCard
                        key={data.id}
                        className={`${activeId === data.id ? 'flex-[0.9]' : activeId ? 'flex-[0.1]' : 'flex-1'}`}
                        data={data}
                        onMouseEnter={() => {
                            setActiveId(data.id)
                            router.replace(`?service=${data.id}`)
                        }}
                        onMouseLeave={() => {
                            setActiveId(null)
                        }}
                        onClick={() => handleClick(data.id)}
                        isBorder={data.isBorder}
                    />
                ))}
            </WidthCard>
        </motion.div>

    )
}

export default NavigationContainer
