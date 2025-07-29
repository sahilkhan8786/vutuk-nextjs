import ClientsContainer from '@/components/custom/clients/ClientsContainer'
import NavigationTopBar from '@/components/custom/home/homeNavigation/NavigationTopBar'
import Services from '@/components/custom/home/services/Services'
import React, { Suspense } from 'react'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


const page = async ({ searchParams }: Props) => {
    const resolvedSearchParams = await searchParams;
    return (
        <div className='relative'>
            <Suspense fallback={<div>Loading...</div>}>
                <NavigationTopBar showOnScrollOnly={false} />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>

                <Services searchParams={resolvedSearchParams} />
            </Suspense>
            <ClientsContainer />
        </div>
    )
}

export default page