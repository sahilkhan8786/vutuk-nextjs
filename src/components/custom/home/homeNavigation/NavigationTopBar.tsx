'use client'
import WidthCard from '@/components/ui/WidthCard';
import useCurrentRoute from '@/hooks/useCurrentRoute';
import useScrollValue from '@/hooks/useScrollValue'
import { useRouter } from 'next/navigation';
import React from 'react';

interface NavigationTopBarProps {
    showOnScrollOnly?: boolean; // optional, default true
}

const NavigationTopBar = ({ showOnScrollOnly = true }: NavigationTopBarProps) => {
    const { isScrolled } = useScrollValue();
    const { activeService } = useCurrentRoute();
    const router = useRouter();

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

    // Decide whether to render based on prop and scroll state
    if (showOnScrollOnly && !isScrolled) {
        return null;
    }

    return (
        <div className='bg-light mt-16 sticky z-50 top-16 shadow'>
            <WidthCard className="h-10 flex items-end justify-start gap-8">
                {['media', 'design', 'web-development'].map((service) => (
                    <p
                        key={service}
                        className={`cursor-pointer hover:-translate-y-1.5 transition ${activeService === service && 'border-b-2 border-primary'}`}
                        onClick={() => handleRedirect(service)}
                    >
                        {`Vutuk ${service === 'web-development' ? 'Web Development' : service.charAt(0).toUpperCase() + service.slice(1)}`}
                    </p>
                ))}
            </WidthCard>
        </div>
    );
}

export default NavigationTopBar;
