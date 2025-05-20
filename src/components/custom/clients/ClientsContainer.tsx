import React from 'react'
import SingleClient from './SingleClient'
import WidthCard from '@/components/ui/WidthCard'


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
        <WidthCard className='bg-white rounded-xl px-2 py-8'>
            <h2 className='text-4xl font-bebas text-center'>Our Clients</h2>
            <p className='text-sm text-center opacity-80'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?</p>

            <div className='slider-wrapper'>
                <div className='slider-track h-[180px]'>
                    {allClients.map((src, idx) => (
                        <SingleClient key={idx} src={src} alt={`Client ${idx + 1}`} />
                    ))}
                </div>
            </div>
        </WidthCard>
    )
}

export default ClientsContainer