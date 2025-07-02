import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6'
import { SiFreelancer } from 'react-icons/si'
import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import TeamMemberForm from '@/components/custom/admin/TeamMemberForm'
import { TeamCardSkeleton } from '@/components/custom/skeletons/TeamCardSkeleton'
import TeamMemberFormWrapper from '@/components/custom/admin/wrappers/TeamMemberFormWrapper'

type TeamMemberProps = {
    _id: string
    username: string;
    image: string;
    position: string;
    freelancerLink: string;
    facebookLink: string;
    instgramLink: string;
    twitterLink: string;
    description: string

}



async function getTeamMembers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team`);

    if (!res.ok) throw new Error('Failed to fetch team members');

    const json = await res.json();
    return json.data.team as TeamMemberProps[]; // adjust key if needed
}


const AdminTeamPage = () => {
    return (
        <div className='bg-white w-full p-2 rounded-xl'>




            <Sheet >
                <SheetTrigger asChild>
                    <Button
                        size={'lg'}
                        className='w-full'>
                        Add Members
                    </Button>

                </SheetTrigger>

                <TeamMemberForm />

            </Sheet>



            <div className='grid grid-row-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2'>

                <Suspense fallback={
                    <>
                        <TeamCardSkeleton />
                        <TeamCardSkeleton />
                        <TeamCardSkeleton />
                        <TeamCardSkeleton />
                    </>
                }>
                    <TeamCard />
                </Suspense>

            </div>
        </div>
    )
}

export default AdminTeamPage;


const TeamCard = async () => {
    const members = await getTeamMembers();

    console.log(members)
    return (
        <>
            {members.map(member => (

                <Card className='overflow-hidden col-span-1 row-span-2 w-full' key={member._id}>
                    <CardHeader className='text-start'>
                        <div className='flex  w-full  justify-center h-[150px]'>


                            <Image
                                src={member.image}
                                alt={member.username}
                                width={300}
                                height={100}
                                className='object-contain object-top'
                            />

                        </div>

                        <CardTitle className='font-bebas text-4xl'>{member.username}</CardTitle>
                        <CardDescription>
                            {member.position}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className='font-rubik opacity-75'>{member.description}</p>
                    </CardContent>
                    <CardFooter className='flex gap-2 items-center w-full'>
                        <h3 className='font-rubik whitespace-nowrap'>Message Me:- </h3>
                        <div className="  w-full flex justify-start gap-4   transition-all  ">
                            <a href={member.instgramLink} className="text-dark hover:text-pink-500">
                                <FaInstagram />
                            </a>
                            <a href={member.facebookLink} className="text-dark hover:text-blue-600">
                                <FaFacebookF />
                            </a>
                            <a href={member.twitterLink} className="text-dark hover:text-sky-400">
                                <FaTwitter />
                            </a>
                            <a href={member.freelancerLink} className="text-dark hover:text-purple-400">
                                <SiFreelancer />
                            </a>
                        </div>
                    </CardFooter>
                    <CardFooter className='flex justify-end gap-4'>

                        <TeamMemberFormWrapper

                            trigger={<Button size={'lg'} >Edit</Button>}
                            isEditing={true} id={member._id} />

                        <Button size={'lg'} >Delete</Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    )

}


