import NavigationTopBar from '@/components/custom/home/homeNavigation/NavigationTopBar'
import ProjectsContainer from '@/components/custom/projectsPage/ProjectsContainer'
import ProjectsSidebar from '@/components/custom/projectsPage/ProjectsSidebar'
import WidthCard from '@/components/ui/WidthCard'
import React, { Suspense } from 'react'

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ProjectsPage = ({ searchParams }: Props) => {
    return (
        <div className='space-y-8 mt-12'>
            <Suspense fallback={<div>Loading...</div>}>
                <NavigationTopBar showOnScrollOnly={false} />
            </Suspense>



            <WidthCard className='grid grid-cols-12 gap-6'>
                <div className='col-span-4 hidden md:block lg:col-span-3'>
                    <ProjectsSidebar className='sticky top-26' />
                </div>

                <ProjectsContainer
                    className='col-span-12 md:col-span-8 lg:col-span-9'
                    searchParams={searchParams}
                />
            </WidthCard>
        </div>
    )
}

export default ProjectsPage
