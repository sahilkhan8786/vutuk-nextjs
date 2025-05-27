import HomeHero from '@/components/custom/home/HomeHero';
import HomeMain from '@/components/custom/home/HomeMain';
import React from 'react'

const HomePage = () => {
  return (
    <div className='relative'>
      <HomeHero />
      <HomeMain />
    </div>
  )
}

export default HomePage;