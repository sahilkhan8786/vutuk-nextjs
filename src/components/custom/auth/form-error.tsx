import { OctagonAlert } from 'lucide-react';
import React from 'react';

interface FormErrorProps {
    message?: string
}

const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null

    return (
        <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
            <OctagonAlert className='size-4 text-red-500' />
            <p>{message}</p>
        </div>
    )
}

export default FormError