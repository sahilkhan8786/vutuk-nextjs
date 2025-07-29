import Image from 'next/image'
import React from 'react'
import ProjectDetailsWrapper from './ProjectDetailsWrapper';

type Project = {
    _id: string;
    projectName: string;
    description: string;
    image: string;
    stream: string;
    contentType: 'data' | 'web';
    websiteUrl?: string;
    projectData?: string[];
    relatedToService?: string;
    slug?: string;
};

const SingleProject = ({ project }: {
    project: Project
}) => {
    console.log(project)

    return (
        <ProjectDetailsWrapper
            project={project}
            trigger={
                <div className='bg-white p-2 rounded-xl overflow-hidden grid  gap-4 hover:shadow shadow-dark cursor-pointer transition-all hover:-translate-y-2 hover:translate-x-2 mb-6 mt-4 w-full grid-cols-2'>
                    <div className='relative  w-full h-[300px]  col-span-2 md:col-span-1'>

                        <Image
                            src={project.image}
                            alt={project.projectName}
                            fill
                            className='rounded-xl w-full absolute top-0 left-0   max-w-[450px] object-contain'
                        />
                    </div>
                    <div className=' flex flex-col items-center justify-center space-y-4 col-span-2 md:col-span-1'>
                        <h2 className='font-bebas text-3xl text-center'>{project.projectName}</h2>
                        <p className='opacity-80 text-center'>{project.description.slice(0, 45)}...</p>
                    </div>
                </div>
            }
        />

    )
}

export default SingleProject