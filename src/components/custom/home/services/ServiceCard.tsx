import Image from 'next/image'
import React from 'react'
type Service = {
    _id: string;
    servicename: string;
    description: string;
    image: string;
    stream: string;
    slug?: string;
};

const ServiceCard = ({ service, isReversed = false }
    : {
        isReversed?: boolean,
        service: Service
    }) => {
    return (
        <div className={`flex gap-6 border-b-light border-b-2 order-2 ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col md:flex-row`}>
            <div className='flex flex-col gap-2 md:gap-4 justify-center flex-1'>
                <h2 className='text-3xl sm:text-5xl md:text-6xl  font-bebas text-center md:text-left mt-4 md:mt-0'>{service.servicename}</h2>
                <p className='rubik opacity-80 text-[14px] text-center md:text-left'>{service.description}</p>
            </div>
            <div className='flex-1'>
                <Image
                    src={service.image}
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