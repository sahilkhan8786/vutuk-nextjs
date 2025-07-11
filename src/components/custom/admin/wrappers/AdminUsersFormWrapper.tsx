'use client'
import React, { ReactNode, useState } from 'react'
import { Button } from "@/components/ui/button"

import {
    Sheet,

    SheetTrigger,
} from "@/components/ui/sheet";
import AdminUserForm from '../AdminUserForm';



const AdminUsersFormWrapper = ({ trigger, isEditing, id }: {
    trigger?: ReactNode
    isEditing?: boolean
    id?: string
}) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger asChild>
                {trigger ? trigger :
                    <Button>
                        Edit
                    </Button>}
            </SheetTrigger>
            {open && <AdminUserForm
                id={id}
                isEditing={isEditing}
                onClose={() => setOpen(false)}
            />}
        </Sheet>
    )
}

export default AdminUsersFormWrapper