'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Link, Loader2 } from 'lucide-react';

export function MergeSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button variant={'outline'} className='text-dark inline-flex items-center justify-center hover hover:border border-light hover:bg-dark hover:text-light'
            type='submit'

        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Merging...
                </>
            ) : (
                <>
                    <Link className="h-4 w-4" />
                    Merge the Data
                </>
            )}
        </Button>
    );
}
