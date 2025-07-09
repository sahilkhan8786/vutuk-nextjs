'use server';

import { connectToDB } from "@/lib/mongodb";
import ProductTypes from "@/models/productType.model";
import { productCategoriesFormSchema } from "@/schemas/additionaDataSchemas";
import { z } from "zod";

export async function addOrUpdateProductExtraDetails(values: z.infer<typeof productCategoriesFormSchema>) {
    try {
        // Normalize inputs
        const productType = values.productType
            .split(",")
            .map(item => item.trim().toLowerCase())
        .filter(Boolean).join(",")

        const mainCategories = values.mainCategories
            .split(",")
            .map(item => item.trim().toLowerCase())
            .filter(Boolean).join(",")

        const subCategories = values.subCategories
            .split(",")
            .map(item => item.trim().toLowerCase())
            .filter(Boolean).join(",")

console.log(productType,subCategories,mainCategories)

        // Update DB
        await connectToDB()
        await ProductTypes.findByIdAndUpdate('686df0505dc4ea12ee9bdf84',{
            productType,
            mainCategories,
            subCategories
        });

        console.log("Updated successfully");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getProductExtraDetails() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product-types`);
    const json = await res.json();
    return json?.data?.productTypes?.[0]; // assuming array
}

