'use client'

import { HomeNavigationItem } from '@/types/types'
import Image from 'next/image'
import React, { MouseEventHandler, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationCardProps {
    className?: string
    onMouseEnter?: MouseEventHandler<HTMLDivElement>
    onMouseLeave?: MouseEventHandler<HTMLDivElement>
    isBorder?: boolean
    data: HomeNavigationItem
}

const NavigationCard = ({
    data,
    className = '',
    onMouseEnter,
    onMouseLeave,
    isBorder = true,
}: NavigationCardProps) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            layout
            transition={{ type: 'tween', stiffness: 300, damping: 30 }}
            onMouseEnter={(e) => {
                setIsHovered(true)
                onMouseEnter?.(e)
            }}
            onMouseLeave={(e) => {
                setIsHovered(false)
                onMouseLeave?.(e)
            }}
            className={`relative flex items-center justify-center flex-col px-6 cursor-pointer overflow-hidden ${className} ${isBorder ? 'border-r' : ''}`}
        >
            <div className="flex items-center flex-col justify-evenly h-full my-16 relative w-full">
                <h1 className={`font-bebas  text-center ${isHovered ? 'text-6xl' : 'text-4xl'}`}>VUTUK {data.title}</h1>

                <AnimatePresence>
                    {isHovered && (
                        <motion.p
                            className="text-sm text-center opacity-80 mt-4 w-[80%]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}

                            transition={{ duration: 0.6 }}
                        >
                            {data.description}
                        </motion.p>
                    )}
                </AnimatePresence>
                <Image width={350} height={100} alt={data.title} src={data.image} />



                {/* Icons Animation */}
                <AnimatePresence>
                    {data.icons.map((el, index) => {
                        const Icon = el.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{
                                    top: `${(el.initialPosition?.y ?? el.position.y) - 20}%`,
                                    left: `${(el.initialPosition?.x ?? el.position.x) - 20}%`,
                                    opacity: 0,
                                }}
                                animate={{
                                    top: `${el.position.y}%`,
                                    left: `${el.position.x}%`,
                                    opacity: isHovered ? 1 : 0,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="absolute"
                            >
                                <Icon className="text-4xl text-light rounded-xl p-1 border bg-primary shadow" />
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default NavigationCard
