import ServicesForm from '@/components/custom/admin/ServicesForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'
import React from 'react'

const AdminServicesPage = () => {
    return (
        <div className='bg-white w-full p-2 rounded-xl'>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size={'lg'}
                        className='w-full'>
                        Add Services
                    </Button>

                </SheetTrigger>

                <ServicesForm />

            </Sheet>

            <div className='grid grid-row-2 grid-cols-3 gap-6 p-2'>
                <Card className='overflow-hidden col-span-1 row-span-2 w-full'>
                    <CardHeader className='text-start'>
                        <div className='flex  w-full  justify-center'>

                            <Image
                                src={'/Video-Editing-services.png'}
                                alt='Video-Editing-services'
                                width={300}
                                height={100}
                                className='object-contain object-top'
                            />
                        </div>

                        <CardTitle className='font-bebas text-4xl'>Name of the service</CardTitle>

                    </CardHeader>

                    <CardContent>
                        <p className='font-rubik opacity-75'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores dolore veniam accusantium reprehenderit architecto incidunt nobis nisi illo expedita. Totam aperiam, adipisci voluptatum impedit ipsum exercitationem assumenda dignissimos sint ea similique aspernatur maxime optio! Optio aut voluptates atque velit voluptate sequi molestias, nulla a, veniam assumenda eligendi eius saepe! Expedita!</p>
                    </CardContent>

                    <CardFooter className='flex justify-end gap-4'>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size={'lg'} >Edit</Button>

                            </SheetTrigger>

                            <ServicesForm isEditing={true} />
                        </Sheet>


                        <Button size={'lg'} >Delete</Button>
                    </CardFooter>
                </Card>


            </div>

        </div>
    )
}

export default AdminServicesPage