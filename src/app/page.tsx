import HomeHero from '@/components/custom/home/HomeHero';
import HomeMain from '@/components/custom/home/HomeMain';
import React, { Suspense } from 'react'

const HomePage = () => {
  return (
    <div className='relative'>
      <HomeHero />
      <Suspense fallback={<div>Loading...</div>}>

        <HomeMain />
      </Suspense>
    </div>
  )
}

export default HomePage;