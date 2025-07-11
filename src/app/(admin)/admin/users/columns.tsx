"use client"

import AdminUsersFormWrapper from "@/components/custom/admin/wrappers/AdminUsersFormWrapper"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
    _id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    addressCount: number;
    phone: number;
    phoneVerfied: boolean;
    createdAt: string;
    role: 'admin' | 'user'
}
export const columns: ColumnDef<User>[] = [

    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.original.image
            const name = row.original.name


            return (
                image ? (
                    <Image src={image} alt={name} width={100} height={100} className="rounded-xl" />
                ) :
                    <div className="size-[100px] rounded-xl flex items-center justify-center bg-gray-200">No Image</div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "_id",
        header: "User ID",
    },
    {
        accessorKey: "name",
        header: "User Name",
    },
    {
        accessorKey: "phone",
        header: "phone",
    },
    {
        accessorKey: "emailVerified",
        header: "Is Email Verified",
    },

    {
        accessorKey: "phoneVerified",
        header: "Is Phone Verified",
    },

    {
        accessorKey: "role",
        header: "User Role",
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            const id = row.original._id;


            return (
                <div className="flex gap-2 items-center">
                    <AdminUsersFormWrapper
                        trigger={<Button>Edit</Button>
                        }
                        id={id}
                    />
                    <Button>Block</Button>
                </div>
            )
        }
    },
]