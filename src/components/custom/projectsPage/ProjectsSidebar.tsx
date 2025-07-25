'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import slugify from 'slugify';

type Stream = {
    _id: string;
    value: string;
};

type Service = {
    _id: string;
    servicename: string;
    stream: string;
};

export default function ProjectsSidebar({ className = '' }) {


    const router = useRouter();
    const searchParams = useSearchParams();

    const [streams, setStreams] = useState<Stream[]>([]);
    const [servicesMap, setServicesMap] = useState<Map<string, Service[]>>(new Map());
    const [loadingStreamId, setLoadingStreamId] = useState<string | null>(null);
    const [expandedStream, setExpandedStream] = useState<string | null>(null);
    function showProjectHandler(servicename: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('service', slugify(servicename, { lower: true, strict: true }))
        router.push(`?${params.toString()}`);
    }

    // Fetch all streams on initial render
    useEffect(() => {
        const fetchStreams = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/streams`);
                const json = await res.json();
                setStreams(json.data.streams || []);
            } catch (err) {
                console.error('Failed to fetch streams', err);
            }
        };

        fetchStreams();
    }, []);

    // Fetch services for a stream value
    const fetchServices = async (streamValue: string) => {
        try {
            setLoadingStreamId(streamValue);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?stream=${encodeURIComponent(streamValue)}`);
            const json = await res.json();

            const services = json.data?.services || [];
            setServicesMap(prev => new Map(prev).set(streamValue, services));
        } catch (err) {
            console.error('Failed to fetch services', err);
        } finally {
            setLoadingStreamId(null);
        }
    };

    // Expand stream and fetch services if not already loaded
    const handleExpand = async (streamId: string) => {
        const streamValue = streams.find(s => s._id === streamId)?.value;
        if (!streamValue) return;

        if (expandedStream === streamValue) {
            setExpandedStream(null);
            return;
        }

        setExpandedStream(streamValue);

        if (!servicesMap.has(streamValue)) {
            await fetchServices(streamValue);
        }
    };

    return (
        <div className={`${className} space-y-4`}>
            {streams.length === 0 && <p>No streams found.</p>}

            {streams.map(stream => (
                <div key={stream._id} className=" rounded   bg-dark text-light ">
                    <div className="flex justify-between items-center  rounded-xl py-2 px-4 ">
                        <h3 className=" whitespace-nowrap">Vutuk {stream.value}

                        </h3>
                        <Button
                            variant="ghost"
                            onClick={() => handleExpand(stream._id)}
                            disabled={loadingStreamId === stream.value}
                        >
                            {expandedStream === stream.value ? '▲ ' : '▼ '}
                        </Button>
                    </div>

                    {expandedStream === stream.value && (
                        <div className="">
                            {loadingStreamId === stream.value ? (
                                <Skeleton className="h-6 w-full" />
                            ) : (
                                servicesMap.get(stream.value)?.map(service => (

                                    <p
                                        key={service._id}
                                        className={cn('p-2 rounded bg-accent text-primary  ml-4 mr-2 mb-4  hover:bg-accent/90 cursor-pointer ')}
                                        onClick={() => showProjectHandler(service.servicename)}
                                    >
                                        {service.servicename}
                                    </p>

                                )) || <p className="text-sm text-muted-foreground">No services found.</p>
                            )}
                        </div>
                    )}
                    <p className='h-2'></p>
                </div>
            ))}
        </div>
    );
}
