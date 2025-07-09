"use client"

import EditProductFormWrapper from "@/components/custom/admin/wrappers/EditProductFormWrapper"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
    _id: string
    title: string
    images: string[]
    price: number
    sku: string
    slug: string
    hasConfigurations: boolean
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue('images') as string[];
            const title = row.getValue('title') as string;
            const image = images[0];


            return <div className=" h-[120px] w-[120px]">
                <Image src={image} alt={title} width={120} height={120} className="rounded-xl" />
            </div>
        }
    },

    {
        accessorKey: "title",
        header: "Product - Title",
        cell: ({ row }) => {
            const title = row.getValue("title") as string;


            return <div className="">{title.slice(0, 40)}...</div>
        }
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount)

            return <div className="">{formatted}</div>
        }

    },

    {
        accessorKey: "sku",
        header: "SKUs",

    },
    {
        accessorKey: "hasConfigurations",
        header: "Is Configured",

    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original;
            const slug = product?.slug as string

            return (
                <div className="flex gap-4 items-center">
                    {/* <Button variant={'outline'} className="hover:hover:opacity-85"
                        onClick={() => console.log(id)}
                    >Edit</Button> */}
                    <EditProductFormWrapper slug={slug} />
                    <Button variant={'destructive'} className="hover:hover:opacity-85"
                        onClick={() => console.log(slug)}
                    >
                        Delete
                    </Button>
                </div>
            )
        },
    },
]