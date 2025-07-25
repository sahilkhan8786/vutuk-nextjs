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
                <div className='bg-white p-2 rounded-xl overflow-hidden grid grid-cols-3 gap-6 hover:shadow shadow-dark cursor-pointer transition-all hover:-translate-y-2 hover:translate-x-2 mb-6'>
                    <div className='relative h-[250px] w-[400px]'>

                        <Image
                            src={project.image}
                            alt={project.projectName}
                            fill
                            className='rounded-xl aspect-video absolute top-0 left-0 object-cover'
                        />
                    </div>
                    <div className='col-span-2 flex flex-col items-center justify-center space-y-4'>
                        <h2 className='font-bebas text-3xl text-center'>{project.projectName}</h2>
                        <p className='opacity-80'>{project.description}</p>
                    </div>
                </div>
            }
        />

    )
}

export default SingleProject