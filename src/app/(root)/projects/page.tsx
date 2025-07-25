import NavigationTopBar from '@/components/custom/home/homeNavigation/NavigationTopBar'
import ProjectsContainer from '@/components/custom/projectsPage/ProjectsContainer'
import ProjectsSidebar from '@/components/custom/projectsPage/ProjectsSidebar'
import WidthCard from '@/components/ui/WidthCard'
import React, { Suspense } from 'react'

const ProjectsPage = ({ searchParams }: {
    searchParams: { [key: string]: string }
}) => {
    return (
        <div className='space-y-8 mt-12'>
            <Suspense fallback={<div>Loading...</div>}>

                <NavigationTopBar showOnScrollOnly={false} />
            </Suspense>

            <WidthCard className='grid grid-cols-12 gap-6'>
                <div className='col-span-2'>
                    <ProjectsSidebar className='sticky top-26' />
                </div>

                <ProjectsContainer className='col-span-10'
                    searchParams={searchParams}
                />
            </WidthCard>
        </div>

    )
}

export default ProjectsPage