import AddProductsFormWrapper from '@/components/custom/admin/wrappers/AddProductsFormWrapper'
import React from 'react'
import { columns, Product } from './columns';
import { DataTable } from './data-table';
import { mergeAdditionalData } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';


async function getData(): Promise<Product[]> {
    // Fetch data from your API here.
    const productRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`)
    const res = await productRes.json();

    return res.data.products;
}

const AdminProductsPage = async () => {
    const data = await getData();



    return (
        <div>
            <div className='flex items-center justify-between w-full bg-dark text-light text-3xl p-3 rounded-xl'>

                <h1 className=''>Our Products</h1>
                <div className='flex gap-2 items-center justify-center'>
                    <form action={mergeAdditionalData}>
                        <Button variant={'outline'} className='text-dark inline-flex items-center justify-center hover hover:border border-light hover:bg-dark hover:text-light'
                        >
                            <Link />
                            Merge the Data
                        </Button>
                    </form>
                    <AddProductsFormWrapper />
                </div>




            </div>
            <div className="mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>



        </div>
    )
}

export default AdminProductsPage