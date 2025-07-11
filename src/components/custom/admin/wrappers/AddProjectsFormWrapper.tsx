'use client';
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import React, { ReactNode, useState } from 'react'
import ProjectsForm from '../ProjectsForm'

const AddProjectsFormWrapper = ({ isEditing, id, trigger }: {
    isEditing?: boolean;
    id?: string;
    trigger?: ReactNode;

}) => {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ? trigger : <Button
                    size={'lg'}
                    className='w-full'>
                    Add Projects
                </Button>}
            </SheetTrigger>

            {open && < ProjectsForm
                isEditing={isEditing}
                id={id}
                onClose={() => setOpen(false)} />}
        </Sheet>
    )
}

export default AddProjectsFormWrapper