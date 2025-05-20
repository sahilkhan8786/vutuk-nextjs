'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import WidthCard from '@/components/ui/WidthCard'
import NavigationCard from './NavigationCard'
import { homeNavigation } from '@/constants/HomeNavigationContainer'
import Image from 'next/image'
import { FaPlay } from 'react-icons/fa6'
import TypeWriterEffect from '@/components/ui/TypeWriterEffect'

type HomeNavigationItem = typeof homeNavigation[number]

const NavigationContainer = () => {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [selectedData, setSelectedData] = useState<HomeNavigationItem>(homeNavigation[0])
    const [isFixed, setIsFixed] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, -200])
    const isInView = useInView(contentRef, { margin: '-200px' })

    // Update selected data when activeId changes
    useEffect(() => {
        if (activeId) {
            const data = homeNavigation.find(item => item.id === activeId)
            if (data) setSelectedData(data)
        } else {
            setSelectedData(homeNavigation[0])
        }
    }, [activeId])

    // Handle scroll to fix the top section
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return

            const container = containerRef.current
            const containerTop = container.getBoundingClientRect().top
            const scrollPosition = window.scrollY

            if (containerTop <= 100 && scrollPosition > 100) {
                setIsFixed(true)
                setScrolled(true)
            } else {
                setIsFixed(false)
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Auto-scroll to content when fixed
    useEffect(() => {
        if (isFixed && scrollContainerRef.current) {
            setTimeout(() => {
                scrollContainerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 800)
        }
    }, [isFixed])

    return (
        <div className='space-y-32' ref={containerRef}>
            {/* Top Section - Expands on hover and becomes fixed on scroll */}
            <motion.div
                style={{ y: isFixed ? 0 : y }}
                className={`${isFixed ? 'fixed top-0 left-0 w-full z-10' : 'relative'}`}
            >
                <WidthCard className={`mt-6 h-[550px] rounded-xl overflow-hidden bg-white transition-all duration-700 ease-in-out ${isFixed ? 'w-full' : ''}`}>
                    <div className='flex h-full w-full'>
                        {homeNavigation.map((data) => (
                            <motion.div
                                key={data.id}
                                className={`${activeId === data.id ? 'flex-[1]' : activeId ? 'flex-[0.1]' : 'flex-1'} transition-all duration-500 overflow-hidden`}
                                onMouseEnter={() => setActiveId(data.id)}
                                onMouseLeave={() => !scrolled && setActiveId(null)}
                            >
                                <NavigationCard
                                    data={data}
                                    isBorder={data.isBorder}
                                />
                            </motion.div>
                        ))}
                    </div>
                </WidthCard>
            </motion.div>

            {/* Spacer to maintain layout when fixed */}
            {isFixed && <div className='h-[550px]' />}

            {/* Dynamic Content Section */}
            <div ref={scrollContainerRef} className='relative z-20'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedData.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 80 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        ref={contentRef}
                    >
                        <WidthCard className='bg-white rounded-xl grid grid-cols-2 py-16 shadow-dark shadow'>
                            <div className='col-span-1 text-dark space-y-8 flex flex-col items-center justify-center px-8'>
                                <h2 className='text-4xl font-bebas font-medium'>We are a team of professional</h2>
                                <TypeWriterEffect
                                    strings={[selectedData.contentSubtitle]}
                                />
                                <p className='text-lg'>
                                    {selectedData.contentDescription}
                                </p>
                                <div className='w-fit flex gap-6 text-dark'>
                                    <span className='flex items-center justify-center border border-dark rounded-full size-12 hover:scale-110 cursor-pointer transition-all'>
                                        <FaPlay className='text-2xl ml-1' />
                                    </span>
                                    <button className='bg-dark text-light rounded-xl px-4 py-3 cursor-pointer border-2 hover:border-dark hover:text-dark hover:bg-light'>
                                        Book a Call
                                    </button>
                                </div>
                            </div>
                            <div className='col-span-1 relative h-[600px]'>
                                <Image
                                    src={selectedData.contentImage}
                                    alt={selectedData.contentTitle}
                                    fill
                                    className='absolute top-0 left-0 object-contain'
                                    priority
                                />
                            </div>
                        </WidthCard>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Additional Details Section */}
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={isInView ? {
                    opacity: 1,
                    y: 0,
                    scale: 1
                } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='relative z-30 bg-white rounded-xl p-16'
            >
                <h2 className='text-3xl font-bold mb-8 text-center'>More About Our {selectedData.title} Services</h2>
                <div className='grid grid-cols-2 gap-12'>
                    <div className='bg-gray-50 p-8 rounded-lg'>
                        <h3 className='text-xl font-semibold mb-4'>What We Offer</h3>
                        <ul className='space-y-4'>
                            {selectedData.features.map((feature: string, index: number) => (
                                <li key={index} className='flex items-start'>
                                    <span className='w-2 h-2 bg-primary rounded-full mt-2 mr-3'></span>
                                    <span className='text-lg'>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='bg-gray-50 p-8 rounded-lg'>
                        <h3 className='text-xl font-semibold mb-4'>Why Choose Us</h3>
                        <p className='text-lg text-gray-700'>
                            {selectedData.whyChooseUs}
                        </p>
                        <div className='mt-6'>
                            <button className='px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors'>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default NavigationContainer