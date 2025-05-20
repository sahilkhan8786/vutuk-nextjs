import ProjectsContainer from '@/components/custom/projectsPage/ProjectsContainer'
import ProjectsSidebar from '@/components/custom/projectsPage/ProjectsSidebar'
import WidthCard from '@/components/ui/WidthCard'
import React from 'react'

const ProjectsPage = () => {
    return (
        <div className='space-y-16'>
            <WidthCard className='grid grid-cols-12 gap-6'>
                <div className='col-span-2'>
                    <ProjectsSidebar className='sticky top-0' />
                </div>
                <ProjectsContainer className='col-span-10' />
            </WidthCard>
        </div>

    )
}

export default ProjectsPage