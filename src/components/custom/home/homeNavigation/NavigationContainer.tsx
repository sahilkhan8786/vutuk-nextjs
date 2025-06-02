'use client'

import WidthCard from '@/components/ui/WidthCard'
import React, { useState } from 'react'
import NavigationCard from './NavigationCard'
import { homeNavigation } from '@/constants/HomeNavigationContainer'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion';
import HomeMain from '../HomeMain'
import useScrollValue from '@/hooks/useScrollValue'
const NavigationContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const { isScrolled } = useScrollValue();
    const router = useRouter()

    const handleClick = (id: string) => {
        router.push(`?service=${id}`)
    }




    return (
        <motion.div

            className='space-y-16 bg-white z-20'

        >
            {isScrolled ?
                <HomeMain />
                : <WidthCard className='flex justify-between items-center rounded-xl overflow-hidden min-h-screen mb-6'>
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
                </WidthCard>}
        </motion.div>

    )
}

export default NavigationContainer
