import WidthCard from '@/components/ui/WidthCard'
import Image from 'next/image'
import React from 'react'
import NavigationContainer from './homeNavigation/NavigationContainer'

const HomeHero = () => {
    return (
        <div>
            <WidthCard className='flex items-center justify-center flex-col'>
                <Image src={'/main-logo.png'}
                    alt='logo'
                    width={300}
                    height={150}
                    className='  object-cover mt-8'
                />
                <p className='font-thin text-3xl mt-4'>Your Vision, Our Execution</p>
            </WidthCard>

            {/* SECTION-CONTAINER */}
            <NavigationContainer />
        </div>
    )
}

export default HomeHero