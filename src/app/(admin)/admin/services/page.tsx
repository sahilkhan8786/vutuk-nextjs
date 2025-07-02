import AddServicesFormWrapper from '@/components/custom/admin/wrappers/AddServicesFormWrapper'
import ServicesCardSkeleton from '@/components/custom/skeletons/ServicesCardSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React, { Suspense } from 'react'


type ServicesProps = {
    _id: string
    servicename: string;
    image: string;
    stream: string;
    slug: string;
    description: string

}


async function getServices() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`);

    if (!res.ok) throw new Error('Failed to fetch services');

    const json = await res.json();
    return json.data.services as ServicesProps[];
}

const AdminServicesPage = () => {
    return (
        <div className='bg-white w-full p-2 rounded-xl'>
            <AddServicesFormWrapper />


            <div className='grid grid-row-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2'>

                <Suspense fallback={
                    <>
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                        <ServicesCardSkeleton />
                    </>
                }>
                    <ServiceCard />
                </Suspense>

            </div>

        </div>
    )
}

export default AdminServicesPage

const ServiceCard = async () => {

    const services = await getServices();

    console.log(services)
    return (
        <>
            {
                services.length === 0 && (
                    <div className='col-span-5 text-center mt-6 text-xl font-semibold text-dark'>
                        No Services to show Yet
                    </div>)
            }
            {services.map((service) => (

                <Card className='overflow-hidden col-span-1 row-span-2 w-full' key={service._id}>
                    <CardHeader className='text-start'>
                        <div className='flex  w-full  justify-center'>

                            <Image
                                src={service.image}
                                alt={service.servicename || 'service Image'}
                                width={300}
                                height={100}
                                className='object-contain object-top'
                            />
                        </div>

                        <CardTitle className='font-bebas text-4xl'>{service.servicename}</CardTitle>

                    </CardHeader>

                    <CardContent>
                        <p className='font-rubik opacity-75'>{service.description}</p>
                    </CardContent>

                    <CardFooter className='flex justify-end gap-4'>

                        <AddServicesFormWrapper
                            trigger={
                                <Button size={'lg'} >Edit</Button>}
                            isEditing={true} id={service.slug} />

                        <Button size={'lg'} >Delete</Button>
                    </CardFooter>
                </Card>

            ))}
        </>
    )
}