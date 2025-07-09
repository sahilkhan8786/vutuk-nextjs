'use server';

import { connectToDB } from "@/lib/mongodb";
import ProductTypes from "@/models/productType.model";



export async function addOrUpdateProductExtraDetails(values: {
    productType: string[],
    mainCategories: string[],
    subCategories: string[],
  }) {
    try {
      await connectToDB();
  
      await ProductTypes.findByIdAndUpdate('686df0505dc4ea12ee9bdf84', {
        productType: values.productType.join(','),
        mainCategories: values.mainCategories.join(','),
        subCategories: values.subCategories.join(','),
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

