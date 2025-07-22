'use client';
import React, { ReactNode, useState } from 'react'


import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import UpdateProfileImageForm from '../UpdateProfileImageForm'

const UpdatProfileImageFormWrapper = ({
    trigger,
    id
}: {
    trigger?: ReactNode,
    id?: string
}) => {

    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger && trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Update Profile Image</SheetTitle>
                    <SheetDescription>
                        Pick the Image. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <UpdateProfileImageForm
                    onClose={() => setOpen(false)}
                    id={id} />
            </SheetContent>
        </Sheet>
    )
}

export default UpdatProfileImageFormWrapper