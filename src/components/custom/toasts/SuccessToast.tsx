'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

export default function SuccessToast() {
    const { pending } = useFormStatus();
    const wasPending = useRef(false);

    useEffect(() => {
        // Transition: from pending to not pending (form just submitted)
        if (wasPending.current && !pending) {
            toast.success('Products merged successfully', {
                description: new Date().toLocaleString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                }),
                position: 'top-center',
            });
        }

        // Track previous pending state
        wasPending.current = pending;
    }, [pending]);

    return null;
}
