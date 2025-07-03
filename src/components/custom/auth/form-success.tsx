import { CheckCircleIcon } from 'lucide-react';
import React from 'react';

interface FormErrorProps {
    message?: string
}

const FormSuccess = ({ message }: FormErrorProps) => {
    if (!message) return null

    return (
        <div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500'>
            <CheckCircleIcon className='size-4 text-emerald-500' />
            <p>{message}</p>
        </div>
    )
}

export default FormSuccess