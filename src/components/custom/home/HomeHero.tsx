import React, { Suspense } from 'react'
import NavigationContainer from './homeNavigation/NavigationContainer'
import NavigationTopBar from './homeNavigation/NavigationTopBar'

const HomeHero = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <NavigationTopBar />
                <NavigationContainer />
            </Suspense>
        </>



    )
}

export default HomeHero