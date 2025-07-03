// app/(admin)/projects/page.tsx

import AddProjectsFormWrapper from "@/components/custom/admin/wrappers/AddProjectsFormWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type ProjectsProps = {
    _id: string;
    projectName: string;
    description: string;
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
        cache: 'no-store',
        next: { tags: ['projects'] }
    })

    if (!res.ok) throw new Error('Failed to fetch projects')
    const json = await res.json()
    return json.data.projects as ProjectsProps[]
}

export default async function AdminProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="bg-white w-full p-2 rounded-xl">
            <AddProjectsFormWrapper />

            <div className="grid grid-row-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2">
                {projects.length === 0 ? (
                    <div className="col-span-5 text-center mt-6 text-xl font-semibold text-dark">
                        No Projects to show Yet
                    </div>
                ) : (
                    projects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))
                )}
            </div>
        </div>
    )
}


function ProjectCard({ project }: { project: ProjectsProps }) {
    return (
        <Card className="overflow-hidden col-span-1 row-span-2 w-full">
            <CardHeader>
                <div className="flex justify-center">
                    <Image
                        src={project.image}
                        alt={project.projectName}
                        width={300}
                        height={100}
                        className="object-contain object-top rounded-xl mb-2"
                        priority
                    />
                </div>
                <CardTitle className="font-bebas text-4xl">{project.projectName}</CardTitle>
            </CardHeader>

            <CardContent>
                <p className="font-rubik opacity-75 mb-6">{project.description}</p>
                <p className="font-rubik">Stream: {project.stream}</p>
                {project.relatedToService && <p className="font-rubik">Service: {project.relatedToService}</p>}
                <p className="font-rubik">Content-Type: {project.contentType}</p>
                {project.videoUrl && <p className="font-rubik">Video: {project.videoUrl}</p>}
                {project.websiteUrl && <p className="font-rubik">Website: {project.websiteUrl}</p>}

                {(project.projectImages ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {(project.projectImages ?? []).map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt={`Project Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="object-cover w-24 h-24"
                            />
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
                <AddProjectsFormWrapper trigger={<Button size="lg">Edit</Button>} isEditing id={project._id} />
                <Button size="lg">Delete</Button>
            </CardFooter>
        </Card>
    )
}
