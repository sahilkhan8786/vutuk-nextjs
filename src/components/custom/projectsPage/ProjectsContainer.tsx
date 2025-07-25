import React from 'react';
import SingleProject from './SingleProject';
import Title from '@/components/ui/Title';


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


async function getProjects(servicename: string) {
    console.log(servicename)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?relatedToService=${servicename}`);
    const json = await res.json();

    return json.data.projects as Project[];
}

const ProjectsContainer = async ({
    searchParams,
    className = ""
}: {
    className?: string,
    searchParams?: { service?: string }
}) => {

    const serviceName = searchParams?.service || '';
    const projects = await getProjects(serviceName);
    console.log(projects)

    return (
        <div className={`${className} py-4 px-4 border-l border-l-dark`}>
            <Title
                heading={`Our Projects`}
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Error deleniti velit nesciunt atque at nemo?'
            />

            {
                projects.map(project => (
                    <SingleProject project={project} key={project._id} />

                ))
            }

        </div>
    );
};

export default ProjectsContainer;
