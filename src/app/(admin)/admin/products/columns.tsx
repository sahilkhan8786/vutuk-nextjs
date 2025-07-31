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
    priceInUSD: number
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


            return <div className="">{title.slice(0, 25)}...</div>
        }
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

    {
        accessorKey: "price",
        header: "Price (INR)",
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
        accessorKey: "priceInUSD",
        header: "Price (USD)",
        cell: ({ row }) => {
            const raw = row.getValue("priceInUSD");
            const amount = parseFloat(String(raw))

            if (isNaN(amount)) {
                return <div>N/A</div>;
            }

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div>{formatted}</div>;
        }
    }
    ,

    {
        accessorKey: "sku",
        header: "SKUs",
        cell: ({ row }) => {
            const sku = row.getValue("sku") as [];
            const filteredSKU = sku.join('').slice(0, 40);
            return <div className="">{filteredSKU}...</div>
        }

    },


]