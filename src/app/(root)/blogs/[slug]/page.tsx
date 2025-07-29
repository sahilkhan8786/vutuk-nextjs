import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React from 'react'

const SingleBlogsPage = () => {
    return (
        <WidthCard className='mt-24'>

            <div className='flex items-center justify-center'>

                <Image
                    src={'/form-1.png'}
                    alt='Image-1'
                    width={500}
                    height={500}
                    className='rounded-xl'
                />
            </div>
            <h1>BLOG TITLE</h1>
            <p>BLOG DESCRIPTION</p>

        </WidthCard>
    )
}

export default SingleBlogsPage