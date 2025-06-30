import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6'
import { SiFreelancer } from 'react-icons/si'
import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import TeamMemberForm from '@/components/custom/admin/TeamMemberForm'

const AdminTeamPage = () => {
    return (
        <div className='bg-white w-full p-2 rounded-xl'>




            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size={'lg'}
                        className='w-full'>
                        Add Members
                    </Button>

                </SheetTrigger>

                <TeamMemberForm />

            </Sheet>



            <div className='grid grid-row-2 grid-cols-3 gap-6 p-2'>
                <Card className='overflow-hidden col-span-1 row-span-2 w-full'>
                    <CardHeader className='text-start'>
                        <div className='flex  w-full  justify-center'>

                            <Image
                                src={'/team-member-1.png'}
                                alt='Irfan Shekh'
                                width={300}
                                height={100}
                                className='object-contain object-top'
                            />
                        </div>

                        <CardTitle className='font-bebas text-4xl'>Name of the Member</CardTitle>
                        <CardDescription>
                            Position Of the Member
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p className='font-rubik opacity-75'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores dolore veniam accusantium reprehenderit architecto incidunt nobis nisi illo expedita. Totam aperiam, adipisci voluptatum impedit ipsum exercitationem assumenda dignissimos sint ea similique aspernatur maxime optio! Optio aut voluptates atque velit voluptate sequi molestias, nulla a, veniam assumenda eligendi eius saepe! Expedita!</p>
                    </CardContent>
                    <CardFooter className='flex gap-2 items-center w-full'>
                        <h3 className='font-rubik whitespace-nowrap'>Message Me:- </h3>
                        <div className="  w-full flex justify-start gap-4   transition-all  ">
                            <a href="#" className="text-dark hover:text-pink-500">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-dark hover:text-blue-600">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="text-dark hover:text-sky-400">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-dark hover:text-purple-400">
                                <SiFreelancer />
                            </a>
                        </div>
                    </CardFooter>
                    <CardFooter className='flex justify-end gap-4'>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size={'lg'} >Edit</Button>

                            </SheetTrigger>

                            <TeamMemberForm isEditing={true} />

                        </Sheet>


                        <Button size={'lg'} >Delete</Button>
                    </CardFooter>
                </Card>


            </div>
        </div>
    )
}

export default AdminTeamPage