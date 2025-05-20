import Image from 'next/image'
import React from 'react'

const SingleClient = ({ src, alt }: { src: string, alt: string }) => {
    return (
        <div className='client-item mt-6'>
            <Image
                src={src}
                alt={alt}
                width={150}
                height={100}
                className='rounded-xl p-4 cursor-pointer border-dark transition-all hover:shadow shadow-dark'
            />
        </div>
    )
}

export default SingleClient