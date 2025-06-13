import Title from '@/components/ui/Title';
import WidthCard from '@/components/ui/WidthCard';
import React from 'react'

const HomePage = () => {
  return (
    // <div className='relative'>
    //   {/* <CarouselComponent /> */}
    //   <HomeHero />
    //   <Services />
    //   <ClientsContainer />
    // </div>
    <div className='mt-24'>
      <Title heading='Vutuk Shop'
        description='Best Designer vases available'>
      </Title>

      <WidthCard className='mb-6 grid grid-cols-4 grid-rows-4 gap-2 h-[75vh]'>

        <div className='w-full h-full bg-red-300 col-span-1 row-span-4'>s</div>
        <div className='w-full h-full bg-red-400 col-span-3 row-span-2'>s</div>
        <div className='w-full h-full bg-red-500 col-span-3 row-span-2'>s</div>

      </WidthCard>

    </div>
  )
}

export default HomePage;