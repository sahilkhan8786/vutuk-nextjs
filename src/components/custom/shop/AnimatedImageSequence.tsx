'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const images = [
    { src: '/form-1.png', label: 'Form 1' },
    { src: '/form-2.png', label: 'Form 2' },
    { src: '/form-3.png', label: 'Form 3' },
    { src: '/form-4.png', label: 'Form 4' },
    { src: '/form-5.png', label: 'Form 5' },
]

export default function AnimatedImageSequence() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [showArrow, setShowArrow] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setShowArrow(true)

            setTimeout(() => {
                setShowArrow(false)
                setActiveIndex((prev) => (prev + 1) % images.length)
            }, 1000) // arrow duration
        }, 4000) // 3s image + 1s arrow

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-green-200 w-full h-full flex items-center justify-between gap-4 p-4 relative">
            {images.map((img, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                    <motion.div
                        animate={{
                            scale: idx === activeIndex ? 2 : 1,
                            zIndex: idx === activeIndex ? 10 : 0,
                        }}
                        transition={{ duration: 1 }}
                    >
                        <Image
                            src={img.src}
                            alt={`image-${idx}`}
                            width={110}
                            height={110}
                            className="rounded "
                        />
                    </motion.div>

                    {/* Show label only if active */}
                    <AnimatePresence>
                        {idx === activeIndex && (
                            <motion.span
                                key={`label-${idx}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5 }}
                                className="mt-2 text-sm font-semibold"
                            >
                                {img.label}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Show arrow only after active image */}
                    {showArrow && idx === activeIndex && idx < images.length - 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 20 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.5 }}
                            className="absolute right-[-30px] top-1/2 -translate-y-1/2"
                        >
                            <ArrowRight size={30} className="text-black" />
                        </motion.div>
                    )}
                </div>
            ))}
        </div>
    )
}
