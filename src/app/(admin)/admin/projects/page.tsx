import AddProjectsFormWrapper from '@/components/custom/admin/wrappers/AddProjectsFormWrapper'
import ServicesCardSkeleton from '@/components/custom/skeletons/ServicesCardSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import Image from 'next/image'
import React, { Suspense } from 'react'

type ProjectsProps = {
    _id: string
    projectName: string;
    description: string
    stream: string;
    image: string;
    contentType: string;
    videoUrl?: string;
    websiteUrl?: string;
    projectImages?: string[];
    relatedToService?: string;
    slug: string;

}


async function getProjects() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);

    if (!res.ok) throw new Error('Failed to fetch projects');

    const json = await res.json();
    return json.data.projects as ProjectsProps[];
}


const AdminProjectsPage = () => {
    return (
        <div className='bg-white w-full p-2 rounded-xl'>
            <AddProjectsFormWrapper />


            <div className='grid grid-row-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2'>

                <Suspense fallback={
                    <>
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                    </>
                }>
                    <ProjectCard />
                </Suspense>

            </div>

            <div className='grid grid-row-2 grid-cols-3 gap-6 p-2'>



            </div>

        </div>
    )
}

export default AdminProjectsPage;

const ProjectCard = async () => {

    const projects = await getProjects();
    console.log(projects)

    return (
        <>

            {
                projects.length === 0 && (
                    <div className='col-span-5 text-center mt-6 text-xl font-semibold text-dark'>
                        No Projects to show Yet
                    </div>)
            }
            {projects.map((project) => (

                <Card className='overflow-hidden col-span-1 row-span-2 w-full' key={project._id} >
                    <CardHeader className='text-start'>
                        <div className='flex  w-full  justify-center'>

                            <Image
                                src={project.image}
                                alt={project.projectName}
                                width={300}
                                height={100}
                                className='object-contain object-top rounded-xl mb-2'
                            />
                        </div>

                        <CardTitle className='font-bebas text-4xl'>{project.projectName}</CardTitle>

                    </CardHeader>

                    <CardContent>
                        <p className='font-rubik opacity-75 mb-6'>{project.description}</p>

                        <p className='font-rubik'>
                            Stream: {project.stream}</p>

                        {
                            project.relatedToService && (
                                <p className='font-rubik'>
                                    Related to Service: {project.relatedToService}
                                </p>
                            )
                        }

                        <p className='font-rubik'>
                            Content-Type: {project.contentType}
                        </p>
                        {
                            project.videoUrl && (
                                <p className='font-rubik'>
                                    Project URL: {project.videoUrl}
                                </p>
                            )
                        }
                        {
                            project.websiteUrl && (
                                <p className='font-rubik'>
                                    Website URL: {project.websiteUrl}
                                </p>
                            )
                        }

                        {
                            project.videoUrl && (
                                <p className='font-rubik'>
                                    Video URL: {project.videoUrl}
                                </p>
                            )
                        }

                        {
                            project.projectImages && project.projectImages.length > 0 && (
                                <div className='flex flex-wrap gap-2 mt-4'>
                                    {project.projectImages.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image}
                                            alt={`Project Image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className='object-cover w-24 h-24'
                                        />
                                    ))}
                                </div>
                            )
                        }

                    </CardContent>

                    <CardFooter className='flex justify-end gap-4'>
                        <AddProjectsFormWrapper
                            trigger={<Button size={'lg'} >Edit</Button>}
                            isEditing={true} id={project._id}
                        />




                        <Button size={'lg'} >Delete</Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    )
}