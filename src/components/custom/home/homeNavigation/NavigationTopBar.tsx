'use client';

import WidthCard from '@/components/ui/WidthCard';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import useScrollValue from '@/hooks/useScrollValue';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface NavigationTopBarProps {
    showOnScrollOnly?: boolean; // optional, default true
}

type StreamProps = {
    _id: string;
    value: string
}
type ServicesProps = {
    _id: string;
    servicename: string
}

const NavigationTopBar = ({ showOnScrollOnly = true }: NavigationTopBarProps) => {
    const [streams, setStreams] = useState<StreamProps[]>([]);
    const [services, setServices] = useState<ServicesProps[]>([]);
    const { isScrolled } = useScrollValue({ scrollValue: 150 });
    const { activeService } = useCurrentRoute();
    const router = useRouter();
    const pathname = usePathname()





    function handleRedirect(clickedService: string) {
        const queryParam = `?service=${clickedService}`;
        router.push(queryParam);
        if (!showOnScrollOnly) return;
        setTimeout(() => {
            window.scrollTo({
                top: 160,
                behavior: 'smooth',
            });
        }, 500);
    }

    useEffect(() => {
        const fetchStreams = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/streams`)
            const json = await res.json();
            setStreams(json.data.streams || [])

        };
        fetchStreams();
    }, [])
    useEffect(() => {
        const fetchServices = async () => {
            console.log("ACTIVE SERVICE", activeService)
            const res = activeService ?
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?stream=${activeService}`)
                : await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services?fields=servicename`)
            const json = await res.json();
            setServices(json.data.services || [])

        };
        fetchServices();
    }, [activeService])


    const shouldShowBar = !showOnScrollOnly || isScrolled;

    return (
        <div className=''>
            {(shouldShowBar && pathname.includes('/services')) ? (
                <div className=" mt-16 sticky z-40 top-16 shadow bg-white">
                    {/* Desktop view */}
                    <div className="hidden md:block">
                        <WidthCard className="h-10 flex items-end justify-center gap-8">
                            {streams.map((stream) => (
                                <p
                                    key={stream._id}
                                    className={`cursor-pointer hover:-translate-y-1.5 transition ${activeService === stream.value ? 'border-b-2 border-primary' : ''
                                        }`}
                                    onClick={() => handleRedirect(stream.value)}
                                >
                                    {`Vutuk ${stream.value === 'web-development'
                                        ? 'Web Development'
                                        : stream.value.charAt(0).toUpperCase() + stream.value.slice(1)
                                        }`}
                                </p>
                            ))}
                        </WidthCard>
                    </div>

                    {/* Mobile scrollable carousel */}
                    <div className="md:hidden overflow-x-auto scrollbar-hide ">
                        <div className="flex gap-4 px-4 py-2 ">
                            {streams.map((stream) => (
                                <button
                                    key={stream._id}
                                    className={`whitespace-nowrap px-4 py-1 text-sm rounded-full border ${activeService === stream.value
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-black border-gray-300'
                                        }`}
                                    onClick={() => handleRedirect(stream.value)}
                                >
                                    Vutuk  {stream.value === 'web-development'
                                        ? 'Web Development'
                                        : stream.value.charAt(0).toUpperCase() + stream.value.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-16 sticky  top-16" style={{ height: '20px', pointerEvents: 'auto' }} />
            )}

            {/* SERVICES NAME */}
            {pathname?.includes('/projects') && <div className='fixed bottom-0 w-full left-0  z-40 bg-secondary'>
                <div className="md:hidden overflow-x-auto scrollbar-hide ">
                    <div className="flex gap-4 px-4 py-2 ">
                        {services.map((service) => (
                            <button
                                key={service._id}
                                className={`whitespace-nowrap px-4 py-1 text-sm rounded-full border ${activeService === service.servicename
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-black border-gray-300'
                                    }`}
                                onClick={() => handleRedirect(service.servicename)}
                            >
                                {service.servicename === 'web-development'
                                    ? 'Web Development'
                                    : service.servicename.charAt(0).toUpperCase() + service.servicename.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default NavigationTopBar;
