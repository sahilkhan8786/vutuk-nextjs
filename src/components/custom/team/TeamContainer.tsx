import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import TeamMember from './TeamMember'

const TeamContainer = () => {
    return (
        <WidthCard className='bg-white rounded-xl px-2 py-8'>
            <h2 className='text-4xl font-bebas text-center'>Meet Our Team</h2>
            <p className='text-sm text-center opacity-80 mb-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?</p>

            <div className='grid grid-cols-2 gap-6'>
                {/* Left column: text */}
                <div className='flex flex-col justify-center'>
                    <h2 className='text-3xl font-semibold mb-4 text-start font-bebas'>
                        Meet Our Passionate Team
                    </h2>
                    <p className='text-start text-lg leading-relaxed opacity-80'>
                        Our team is a diverse group of creative professionals dedicated to delivering high-impact solutions. From designers and developers to strategists and storytellers, we work together to bring your vision to life with precision and purpose.
                    </p>
                </div>


                {/* Right column: grid of team members */}
                <div className='grid grid-cols-2 grid-rows-2 h-[450px] gap-6'>
                    <TeamMember
                        name='IRFAN SHEKH'
                        role='FOUNDER'
                        className='col-span-1 row-span-2' />
                    <TeamMember name='IRFAN SHEKH'
                        role='FOUNDER' />
                    <TeamMember name='IRFAN SHEKH'
                        role='FOUNDER' />
                </div>
            </div>
        </WidthCard>
    )
}

export default TeamContainer