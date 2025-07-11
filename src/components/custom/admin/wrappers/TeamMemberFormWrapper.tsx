'use client';

import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import React, { ReactNode, useState } from 'react'
import TeamMemberForm from '../TeamMemberForm'

const TeamMemberFormWrapper = ({ trigger, isEditing, id }: {
    trigger?: ReactNode,
    isEditing?: boolean,
    id?: string
}) => {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ?
                    trigger
                    : <Button
                        size={'lg'}
                        className='w-full'>
                        Add Members
                    </Button>}

            </SheetTrigger>

            {open && <TeamMemberForm
                isEditing={isEditing}
                id={id}
                onClose={() => setOpen(false)} />}

        </Sheet>
    )
}

export default TeamMemberFormWrapper