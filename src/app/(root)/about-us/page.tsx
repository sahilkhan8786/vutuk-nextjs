import AboutDetails from '@/components/custom/aboutPage/AboutDetails'
import AboutHero from '@/components/custom/aboutPage/AboutHero'
import ClientsContainer from '@/components/custom/clients/ClientsContainer'
import TeamContainer from '@/components/custom/team/TeamContainer'
import { aboutDetailsSection } from '@/constants/about'
import React from 'react'

const AboutUsPage = () => {
    return (
        <div className='space-y-16 mt-[70px]'>
            <AboutHero />
            {
                aboutDetailsSection.map(section => (
                    <AboutDetails key={section.id} data={section} />
                ))
            }
            <ClientsContainer />
            <TeamContainer />
        </div>
    )
}

export default AboutUsPage