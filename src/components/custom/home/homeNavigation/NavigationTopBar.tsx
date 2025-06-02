'use client'
import WidthCard from '@/components/ui/WidthCard';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import useScrollValue from '@/hooks/useScrollValue'
import { useRouter } from 'next/navigation';
import React from 'react'


const NavigationTopBar = () => {

    const { isScrolled } = useScrollValue();
    const { activeService } = useCurrentRoute();
    const router = useRouter();


    function handleRedirect(clickedService: string) {
        const queryParam = `?service=${clickedService}`;
        router.push(queryParam)

        setTimeout(() => {
            window.scrollTo({
                top: 160,
                behavior: 'smooth',
            });
        }, 500);
    }


    return (isScrolled &&
        <>
            <div className='bg-light mt-16 sticky z-50 top-16 shadow'>
                <WidthCard className="h-10 flex items-end justify-start gap-8">
                    {['media', 'design', 'web-development'].map((service) => (
                        <p
                            key={service}
                            className={`cursor-pointer hover:-translate-y-1.5 transition ${activeService === service && 'border-b-2 border-primary'
                                }`}
                            onClick={() => handleRedirect(service)}
                        >
                            {`Vutuk ${service === 'web-development' ? 'Web Development' : service.charAt(0).toUpperCase() + service.slice(1)}`}
                        </p>
                    ))}
                </WidthCard>

            </div>

        </>
    )
}

export default NavigationTopBar