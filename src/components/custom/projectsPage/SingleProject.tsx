import Image from 'next/image'
import React from 'react'

const SingleProject = () => {
    return (
        <div className='bg-white p-2 rounded-xl overflow-hidden grid grid-cols-3 gap-6 hover:shadow shadow-dark cursor-pointer transition-all hover:-translate-y-2 hover:translate-x-2 mb-6'>
            <div className='relative h-[250px] w-[400px]'>

                <Image
                    src={'/projects-1.jpg'}
                    alt='projects -1'
                    fill
                    className='rounded-xl aspect-video absolute top-0 left-0 object-cover'
                />
            </div>
            <div className='col-span-2 flex flex-col items-center justify-center space-y-4'>
                <h2 className='font-bebas text-3xl text-center'>Vaskeperfume Animated Advertisement</h2>
                <p className='opacity-80'>🎵 Embark on a soul-enriching musical journey with Riyaaz Qawwali - the esteemed custodians of Qawwali music! Get ready to immerse yourself in the art of Qawwali with our captivating animated intro, thoughtfully crafted by Vutuk Media. Join us as we unveil the heartwarming music lessons on Qawwali offered by the talented maestros of Riyaaz Qawwali.</p>
            </div>
        </div>
    )
}

export default SingleProject