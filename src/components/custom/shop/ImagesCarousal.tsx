"use client"

import * as React from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ImagesCarousalProps {
    images: string[]
}

export default function ImagesCarousal({ images }: ImagesCarousalProps) {
    const [current, setCurrent] = React.useState<number>(0)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        if (images.length === 0) return

        const changeImage = () => {
            setCurrent((prev) => (prev + 1) % images.length)
            const randomDelay =
                Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000
            timerRef.current = setTimeout(changeImage, randomDelay)
        }

        changeImage()

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [images.length])

    return (
        <div className="relative w-full h-80 overflow-hidden rounded-xl">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Skeleton
                        className="w-full h-full bg-primary/45"
                    />
                    <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        fill
                        sizes="100vw"
                        className="object-cover object-center rounded-xl"
                    />
                </div>
            ))}
        </div>
    )
}
