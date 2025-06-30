import ClientsContainer from '@/components/custom/clients/ClientsContainer'
import HomeHero from '@/components/custom/home/HomeHero'
import Services from '@/components/custom/home/services/Services'
import React from 'react'

const page = () => {
    return (
        <div className='relative'>
            {/* <CarouselComponent /> */}
            <HomeHero />
            <Services />
            <ClientsContainer />
        </div>
    )
}

export default page