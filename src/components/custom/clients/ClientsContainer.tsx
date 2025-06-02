import React from 'react'
import SingleClient from './SingleClient'
import WidthCard from '@/components/ui/WidthCard'
import Title from '@/components/ui/Title'


const clients = [
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',
    '/client-1.png',

]

const ClientsContainer = () => {
    const allClients = [...clients, ...clients]
    return (
        <div className='bg-white'>


            <WidthCard className='  px-2 py-8'>
                <Title
                    heading='Our Clients'
                    description='We are service all around the world'
                />



                <div className='slider-wrapper'>
                    <div className='slider-track h-[180px]'>
                        {allClients.map((src, idx) => (
                            <SingleClient key={idx} src={src} alt={`Client ${idx + 1}`} />
                        ))}
                    </div>
                </div>
            </WidthCard>
        </div>
    )
}

export default ClientsContainer