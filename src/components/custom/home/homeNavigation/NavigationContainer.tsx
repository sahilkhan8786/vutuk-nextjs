'use client'

import WidthCard from '@/components/ui/WidthCard'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import useScrollValue from '@/hooks/useScrollValue'
import Image from 'next/image'
import { FaPlay } from 'react-icons/fa'
import useCurrentRoute from '@/hooks/useCurrentRoute'
import { heroMainData } from '@/constants/heromain'

const NavigationContainer = () => {
    const router = useRouter()
    const { isScrolled } = useScrollValue({ scrollValue: 150 })
    const { activeService } = useCurrentRoute()

    // Initialize activeId with current activeService from URL param
    const [activeId, setActiveId] = useState<string | null>(activeService || null)

    // Keep activeId synced with URL activeService if it changes externally
    useEffect(() => {
        setActiveId(activeService || null)
    }, [activeService])

    const handleClick = (id: string) => {
        // Using router.replace with scroll true (works in Next 13)
        router.replace(`?service=${id}`, { scroll: true })
    }

    return (
        <motion.div className="space-y-16  z-20">
            <div className="flex justify-between items-center rounded-xl overflow-hidden min-h-screen mb-6">
                <motion.div className="flex w-full h-[120vh] overflow-hidden gap-6">
                    {heroMainData.map((box) => {
                        const isActive = activeId === box.service

                        // Hide non-active cards when scrolled
                        if (isScrolled && !isActive) return null

                        return (
                            <motion.div
                                key={box.id}
                                className={`${box.bg} h-full flex items-center justify-center flex-col transition-all relative overflow-hidden cursor-pointer`}
                                onMouseEnter={() => {
                                    if (!isScrolled) {
                                        setActiveId(box.service)
                                        handleClick(box.service)
                                    }
                                }}
                                onClick={() => {
                                    handleClick(box.service)
                                    window.scrollTo({ top: 250, behavior: 'smooth' })
                                }}
                                animate={{
                                    width: isScrolled ? '100%' : isActive ? '100%' : '80%',
                                    y: isScrolled ? 0 : isActive ? -20 : 20,
                                    opacity: isScrolled ? 1 : isActive ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Normal hover content when not scrolled */}
                                {!isScrolled && (
                                    <>
                                        <h2 className="text-white text-4xl  whitespace-nowrap">{box.title}</h2>
                                        <Image
                                            src={box.image}
                                            alt={box.title}
                                            width={300}
                                            height={300}
                                            className="object-contain mt-4"
                                        />
                                        <Image
                                            src={'/scroll-down.gif'}
                                            alt='Scroll Down Icon'
                                            width={60}
                                            height={60}
                                            className='object-contain'
                                        />
                                    </>
                                )}

                                {/* Detailed content when scrolled and active */}
                                {isScrolled && isActive && (
                                    <WidthCard className="grid grid-cols-2 gap-8 w-full px-12 items-center h-full pt-44">
                                        {/* TEXT SECTION */}
                                        <motion.div
                                            className="col-span-1 flex flex-col justify-center items-start space-y-6 text-white "
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                        >
                                            <h3 className="text-xl uppercase">We are a team of professionals</h3>
                                            <h1 className="text-4xl font-bold">{box.typewriterText}</h1>
                                            <p>{box.description}</p>
                                            <div className="flex gap-4">
                                                <span className="flex items-center justify-center border border-white rounded-full size-12 hover:scale-110 transition-all cursor-pointer">
                                                    <FaPlay className="text-2xl ml-1" />
                                                </span>
                                                <button className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
                                                    Book a Call
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* IMAGE SECTION */}
                                        <motion.div
                                            className="col-span-1 relative h-[550px]"
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Image
                                                src={box.expandedImage}
                                                alt={box.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </motion.div>
                                    </WidthCard>
                                )}
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default NavigationContainer
