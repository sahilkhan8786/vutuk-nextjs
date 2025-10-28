'use client';
import React, { useState } from 'react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import AddCouponsForm from '../AddCouponsForm'

const AddCouponsFormWrapper = () => {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant={'outline'} className='text-dark inline-flex items-center justify-center hover hover:border border-light hover:bg-dark hover:text-light'
                >
                    <PlusIcon />
                    Add Coupons
                </Button>
            </SheetTrigger>
            <SheetContent className='overflow-y-scroll'>
                <SheetHeader>
                    <SheetTitle>Add Coupons</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                    <AddCouponsForm onClose={() => setOpen(false)} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default AddCouponsFormWrapper