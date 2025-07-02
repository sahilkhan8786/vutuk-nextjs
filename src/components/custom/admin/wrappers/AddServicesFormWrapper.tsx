'use client';
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import React, { useState } from 'react'
import ServicesForm from '../ServicesForm'

const AddServicesFormWrapper = ({ isEditing, id, trigger }: {
    isEditing?: boolean;
    id?: string;
    trigger?: React.ReactNode;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ? trigger : <Button
                    size={'lg'}
                    className='w-full'>
                    Add Services
                </Button>}

            </SheetTrigger >

            <ServicesForm
                id={id}
                isEditing={isEditing}
                onClose={() => setOpen(false)}
            />

        </Sheet>
    )
}

export default AddServicesFormWrapper