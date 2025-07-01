'use server'
import { connectToDB } from '@/lib/mongodb';
import AdditionalProductData from '@/models/additional-product-data.model';
import Product from '@/models/product.model';
import { editProductSchema } from '@/schemas/editProductSchema';
import { parse } from 'csv-parse/sync' 
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { z } from 'zod';


function transformProduct(raw: Record<string, string>) {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    const imgKey = `IMAGE${i}`;
    if (raw[imgKey]) {
      images.push(raw[imgKey]);
    }
  }

  const tags = raw.TAGS?.split(',').map(tag => tag.trim().toLowerCase()) || [];

  const variations = [];
  if (raw['VARIATION 1 TYPE'] && raw['VARIATION 1 NAME']) {
    variations.push({
      type: raw['VARIATION 1 TYPE'],
      name: raw['VARIATION 1 NAME'],
      values: raw['VARIATION 1 VALUES'].split(',').map(val => val.trim().toLowerCase())
    });
  }

  // Optional: Add second variation if present
  if (raw['VARIATION 2 TYPE'] && raw['VARIATION 2 NAME']) {
    variations.push({
      type: raw['VARIATION 2 TYPE'],
      name: raw['VARIATION 2 NAME'],
      values: raw['VARIATION 2 VALUES'].split(',').map(val => val.trim().toLowerCase())
    });
  }

  return {
    title: raw.TITLE.toLowerCase(),
    description: raw.DESCRIPTION.trim(),
    price: parseFloat(raw.PRICE),
    currencyCode: raw.CURRENCY_CODE,
    quantity: parseInt(raw.QUANTITY, 10),
    tags,
    materials: raw.MATERIALS || '',
    images,
    variations,
    sku: raw.SKU.split(',').map(s => s.trim().toLowerCase()),
    slug: slugify(raw.TITLE.toLowerCase(), { lower: true, trim: true }),
    hasConfigurations:false
  };
}



export async function createproductsFromCSV(formData:FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error("No File Uploaded");
    await connectToDB();

    const arrayBuffer = await file.arrayBuffer();
    const text = Buffer.from(arrayBuffer).toString('utf-8');

    const products = parse(text, {
        columns: true,
        relax_column_count: true,
        relax_quotes: true,
        trim: true,
    skip_empty_lines:true
    });
    const finalProducts = [];

    for (const rawProduct  of products) {
        const product = transformProduct(rawProduct);
        finalProducts.push(product);


    };

    await Product.deleteMany({});
    await Product.insertMany(finalProducts);


console.log('Parsed and Transformed Products:', finalProducts);


    console.log(products);
    revalidatePath('/admin/products');
}

export async function createProductConfigurator(values: z.infer<typeof editProductSchema>) {
  try {
    const alreadyExists = await AdditionalProductData.findOne({
      configKey: values.configKey,
    });

    if (!alreadyExists) {
      await AdditionalProductData.create(values);
    } else {
      // ✅ Provide update payload here!
      await AdditionalProductData.findOneAndUpdate(
        { configKey: values.configKey },
        values,
        { new: true } // optional: returns updated doc
      );
    }

    revalidatePath('/admin/products');
  } catch (error) {
    console.error("❌ Error in createProductConfigurator:", error);
    throw error;
  }
}



export async function mergeAdditionalData() {
  const products = await Product.find({});
  const additionalProductData = await AdditionalProductData.find({});

  for (const product of products) {
    const sku = Array.isArray(product.sku) ? product.sku[0] : null;
    const configKey = sku?.split('_')[1];

    if (!configKey) continue;

    const matchedData = additionalProductData.find(
      (data) => data.configKey === configKey
    );

    if (matchedData && matchedData.variantMappings) {
      await Product.findByIdAndUpdate(product._id, {
        hasConfigurations: true,
        configurations: matchedData.variantMappings,
      });
    }
  }
  revalidatePath('/admin/products');
}
