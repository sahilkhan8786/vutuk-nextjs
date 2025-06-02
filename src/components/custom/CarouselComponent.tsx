'use client';

import React, { useEffect, useState } from 'react';
import { homeNavigation } from '@/constants/HomeNavigationContainer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const CarousalComponent = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();

    const total = homeNavigation.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % total);
        }, 6000);
        return () => clearInterval(interval);
    }, [total]);

    const handleClick = (index: number) => {
        setActiveIndex(index);
        router.push(`?service=${homeNavigation[index].id}`);
    };

    const next = () => handleClick((activeIndex + 1) % total);
    const prev = () => handleClick((activeIndex - 1 + total) % total);

    const getCardIndex = (offset: number) => (activeIndex + offset + total) % total;

    const activeData = homeNavigation[activeIndex];

    return (
        <div className="relative grid grid-cols-10 gap-8 h-[950px] bg-white overflow-hidden px-12">
            {/* Left: Carousel (30%) */}
            <div className="relative col-span-3 flex justify-center items-center flex-col">
                {/* Buttons */}
                <button
                    onClick={prev}
                    className=" bg-gray-200 p-3 rounded-full shadow absolute bottom-10"
                >
                    <ArrowLeft />
                </button>
                <button
                    onClick={next}
                    className=" z-10 bg-gray-200 p-3 rounded-full shadow absolute bottom-10 translate-x-14"
                >
                    <ArrowRight />
                </button>

                {/* Cards */}
                <div className="relative w-full h-[400px] flex justify-center items-center perspective-1000 overflow-visible">
                    {[-1, 0, 1].map((offset) => {
                        const index = getCardIndex(offset);
                        const data = homeNavigation[index];
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={data.id}
                                onClick={() => handleClick(index)}
                                initial={false}
                                animate={{
                                    scale: isActive ? 1 : 0.5,
                                    x: isActive ? offset * 150 : -150, // Horizontal positioning
                                    y: isActive ? offset * 150 : 200,
                                    z: isActive ? 0 : -150, // Depth effect
                                    rotateY: isActive ? 0 : offset * 20, // 3D rotation
                                    opacity: isActive ? 1 : 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15
                                }}
                                className={`absolute cursor-pointer rounded-xl bg-white shadow-xl transition-all duration-500 px-6 py-8 w-[300px] h-[350px] text-center flex flex-col items-center justify-between`}
                                style={{
                                    transformStyle: "preserve-3d", // Enable 3D transformations
                                }}
                            >
                                <div className="transform-style-preserve-3d">
                                    <h2 className="text-2xl font-bold mb-2">VUTUK {data.title}</h2>
                                    <p className="text-sm opacity-80 mb-4">{data.description}</p>
                                </div>
                                <div className="w-full h-[150px] relative transform-style-preserve-3d">
                                    <Image
                                        width={150}
                                        height={150}
                                        src={data.image}
                                        alt={data.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>


            </div>

            {/* Right: Active card details (70%) */}
            <div className="col-span-7 p-8 bg-gray-50 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-extrabold mb-4">VUTUK {activeData.title}</h1>
                <p className="text-lg opacity-90 mb-6">{activeData.description}</p>
                <Image
                    width={400}
                    height={400}
                    src={activeData.image}
                    alt={activeData.title}
                    className="object-contain rounded-md"
                />
            </div>
        </div>
    );
};

export default CarousalComponent;
