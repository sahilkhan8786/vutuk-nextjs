import React from 'react'
import SingleProject from './SingleProject'
import Title from '@/components/ui/Title'

const ProjectsContainer = ({ className = "" }: {
    className?: string
}) => {
    return (
        <div className={`${className} py-4 px-4 border-l border-l-dark`}>

            <Title
                heading='Our Projects'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?'
            />

            <SingleProject />
            <SingleProject />
            <SingleProject />
        </div>
    )
}

export default ProjectsContainer