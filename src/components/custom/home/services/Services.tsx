import Title from '@/components/ui/Title'
import WidthCard from '@/components/ui/WidthCard'
import React from 'react'
import ServiceCard from './ServiceCard'
type Service = {
    _id: string;
    servicename: string;
    description: string;
    image: string;
    stream: string;
    slug?: string;
};


async function getServices(servicename: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?stream=${servicename}`);
    const json = await res.json();

    return json.data.services as Service[];
}

const Services = async ({ searchParams }: {
    searchParams?: { service?: string }
}) => {

    const serviceName = searchParams?.service || '';
    const services = await getServices(serviceName);

    return (
        <div className=' bg-white py-6  '>
            <WidthCard className='px-2 mt-4'>
                <Title heading='Our Services'
                    description='We are offering the best in our fields'
                />

                <div className='grid gap-4'>
                    {
                        services.map((service, index) => (

                            <ServiceCard service={service} key={service._id}
                                isReversed={index % 2 !== 0}
                            />
                        ))
                    }
                </div>

            </WidthCard>
        </div>
    )
}

export default Services