'use client'

import WidthCard from '@/components/ui/WidthCard'
import React, { useEffect, useRef, useState } from 'react'
import NavigationCard from './NavigationCard'
import { homeNavigation } from '@/constants/HomeNavigationContainer'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion';

const NavigationContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [hasScrolled, setHasScrolled] = useState(false)
    const router = useRouter()
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 0.5], [0, 600])
    const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.6])

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((v) => {
            if (v > 0.1 && !hasScrolled) {
                setHasScrolled(true)
            } else if (v <= 0.1 && hasScrolled) {
                setHasScrolled(false)
                setActiveId(null)
            }
        })

        return () => unsubscribe()
    }, [scrollYProgress, hasScrolled])


    const handleClick = (id: string) => {
        router.push(`?service=${id}`)
    }

    return (
        <motion.div
            ref={ref}
            className='space-y-16 bg-white z-20'
            style={{ y, scale }}
        >
            <WidthCard className='flex justify-between items-center rounded-xl overflow-hidden min-h-screen mb-6'>
                {homeNavigation.map((data) => {
                    const isActive = activeId === data.id

                    // Hide all other cards if scrolled and one is active
                    if (hasScrolled && !isActive) return null

                    return (
                        <NavigationCard
                            key={data.id}
                            className={`
                                ${hasScrolled && isActive ? 'flex-1' : ''}
                                ${!hasScrolled && (isActive ? 'flex-[0.9]' : activeId ? 'flex-[0.1]' : 'flex-1')}
                            `}
                            data={data}
                            onMouseEnter={() => {
                                if (!hasScrolled) {
                                    setActiveId(data.id)
                                    router.replace(`?service=${data.id}`)
                                }
                            }}
                            onMouseLeave={() => {
                                if (!hasScrolled) setActiveId(null)
                            }}
                            onClick={() => handleClick(data.id)}
                            isBorder={!hasScrolled && data.isBorder}
                        />
                    )
                })}
            </WidthCard>
        </motion.div>
    )
}

export default NavigationContainer
