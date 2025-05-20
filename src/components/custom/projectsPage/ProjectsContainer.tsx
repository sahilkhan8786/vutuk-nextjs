import React from 'react'
import SingleProject from './SingleProject'

const ProjectsContainer = ({ className = "" }: {
    className?: string
}) => {
    return (
        <div className={`${className} py-6 px-4 border-l`}>

            <h2 className='text-6xl font-bebas text-center'>Our Projects</h2>
            <p className='text-sm text-center opacity-80 mb-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?</p>
            <SingleProject />
            <SingleProject />
            <SingleProject />
        </div>
    )
}

export default ProjectsContainer