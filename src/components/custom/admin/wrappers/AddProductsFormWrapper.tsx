'use client';

import React, { useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';
import AddProductsForm from '../AddProductsForm';
const AddProductsFormWrapper = () => {
    const [open, setOpen] = useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>

                <Button variant={'outline'} className='text-dark inline-flex items-center justify-center hover hover:border border-light hover:bg-dark hover:text-light'
                >
                    <PlusIcon />
                    Add Products
                </Button>

            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Upload the CSV from the Etsy so Add All The Products</DrawerTitle>
                    <DrawerDescription>Please be carefull while uploading , It can casue the errors in website functionality.</DrawerDescription>
                </DrawerHeader>

                {open && <AddProductsForm onClose={() => setOpen(false)} />
                }
            </DrawerContent>
        </Drawer>
    )
}

export default AddProductsFormWrapper