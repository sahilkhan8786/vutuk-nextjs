import Title from '@/components/ui/Title'
import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import ServiceCard from './ServiceCard'

const Services = () => {
    return (
        <div className='my-6 bg-white py-6 '>
            <WidthCard className='px-2'>
                <Title heading='Our Services'
                    description='We are offering the best in our fields'
                />

                <ServiceCard />
                <ServiceCard isReversed={true} />

            </WidthCard>
        </div>
    )
}

export default Services