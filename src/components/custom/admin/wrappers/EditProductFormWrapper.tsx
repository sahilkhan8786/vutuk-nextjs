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
import { Button } from '@/components/ui/button';
import EditProductForm from '../EditProductForm';

const EditProductFormWrapper = ({ slug }: {
    slug?: string
}) => {
    const [open, setOpen] = useState(false)


    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    Edit
                </Button>

            </SheetTrigger>
            {open && <SheetContent side='right' className='overflow-y-scroll'

            >
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                    <EditProductForm slug={slug}
                        onClose={() => setOpen(false)}
                    />
                    <SheetDescription>
                        Create the Product configurator Carefully because It can break website functionality
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>}
        </Sheet>
    )
}

export default EditProductFormWrapper