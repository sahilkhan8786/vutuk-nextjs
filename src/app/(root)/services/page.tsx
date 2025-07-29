import ClientsContainer from '@/components/custom/clients/ClientsContainer'
import NavigationTopBar from '@/components/custom/home/homeNavigation/NavigationTopBar'
import Services from '@/components/custom/home/services/Services'
import React, { Suspense } from 'react'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


const page = ({ searchParams }: Props) => {
    return (
        <div className='relative'>
            <Suspense fallback={<div>Loading...</div>}>
                <NavigationTopBar showOnScrollOnly={false} />
            </Suspense>
            <Services searchParams={searchParams} />
            <ClientsContainer />
        </div>
    )
}

export default page