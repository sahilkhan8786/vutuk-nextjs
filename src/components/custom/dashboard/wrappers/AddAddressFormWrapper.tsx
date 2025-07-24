
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import React, { ReactNode, useState } from 'react'
import AddAddressForm from '../AddAddressForm'

const AddAddressFormWrapper = ({ trigger }: {
    trigger?: ReactNode
}) => {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger && trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add Address</SheetTitle>
                    <SheetDescription>
                        Add carefully it is not changable
                    </SheetDescription>
                </SheetHeader>
                <AddAddressForm
                    onClose={() => setOpen(false)}
                />


            </SheetContent>
        </Sheet>
    )
}

export default AddAddressFormWrapper