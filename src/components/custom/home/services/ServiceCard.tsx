import Image from 'next/image'
import React from 'react'

const ServiceCard = ({ isReversed = false }
    : {
        isReversed?: boolean
    }) => {
    return (
        <div className={`flex gap-6 border-b-light border-b-2 order-2 ${isReversed && 'flex-row-reverse'}`}>
            <div className='flex flex-col gap-6 justify-center flex-1'>
                <h2 className='text-6xl font-bebas'>Video Services</h2>
                <p className='rubik opacity-80'>Our Video Editing Service transforms raw footage into captivating visual stories. Our skilled editors enhance colors, merge clips, and add effects, creating professional-quality videos that engage your audience. Whether for personal memories, business promotions, or creative projects, we tailor our editing to your vision, meeting your deadlines with precision. Elevate your videos with us, where your vision meets expertise.</p>
            </div>
            <div className='flex-1'>
                <Image
                    src={'/Video-Editing-services.png'}
                    alt='Video Service'
                    width={500}
                    height={500}
                    className=' object-contain '
                />
            </div>
        </div>
    )
}

export default ServiceCard