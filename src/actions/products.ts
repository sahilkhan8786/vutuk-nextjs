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
    hasConfigurations: false
  };
}



export async function createproductsFromCSV(formData: FormData) {
  try {

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
      skip_empty_lines: true
    });
    const finalProducts = [];

    for (const rawProduct of products) {
      const product = transformProduct(rawProduct);
      finalProducts.push(product);


    };

    await Product.deleteMany({});
    await Product.insertMany(finalProducts);


    revalidatePath('/admin/products');
  } catch (error) {
    console.error("❌ Error in Uplaoding daa from CSV:", error);
    throw error;
  }
}

export async function createProductConfigurator(values: z.infer<typeof editProductSchema>) {


  try {
    await connectToDB();

    const alreadyExists = await AdditionalProductData.findOne({
      configKey: values.configKey,

    });
    let updatedData;

    if (!alreadyExists) {
      updatedData = await AdditionalProductData.create(values);
    } else {
      // ✅ Provide update payload here!
      updatedData = await AdditionalProductData.findOneAndUpdate(
        { configKey: values.configKey },
        values,
        { new: true } // optional: returns updated doc
      );


    }
    const matchingProduct = await Product.findOne({
      sku: { $regex: values.configKey, $options: 'i' }
    });

    const filteredImages = matchingProduct.images.filter(
      (img: string) => !updatedData.sizeImages.includes(img)
    );
    const finalProduct = await Product.findByIdAndUpdate(matchingProduct._id, {
      title: updatedData.title,
      videoURL: updatedData.videoURL,
      description: updatedData.description,
      sizeImages: values.sizeImages,
      images: filteredImages,
      hasConfigurations: true,
      mainCategories: updatedData.mainCategories,
      productType: updatedData.productType,
      subCategories: updatedData.subCategories,
      price: Number(values.price),
      priceInUSD: Number(values.priceInUSD),
    });
    console.log(finalProduct)

    revalidatePath('/admin/products');
  } catch (error) {
    console.error("❌ Error in createProductConfigurator:", error);
    throw error;
  }
}



export async function mergeAdditionalData() {
  try {

    await connectToDB();
    const products = await Product.find({});
    const additionalProductData = await AdditionalProductData.find({});

    for (const product of products) {
      const sku = Array.isArray(product.sku) ? product.sku[0] : null;
      const configKey = sku?.split('_')[1];

      if (!configKey) continue;

      const matchedData = additionalProductData.find(
        (data) => data.configKey === configKey
      );

      if (matchedData) {
        const filteredImages = product.images.filter((img: string) => !matchedData.sizeImages.includes(img));
        await Product.findByIdAndUpdate(product._id, {
          title: matchedData.title,
          videoURL: matchedData.videoURL,
          description: matchedData.description,
          sizeImages: matchedData.sizeImages,
          images: filteredImages,
          hasConfigurations: true,
          mainCategories: matchedData.mainCategories,
          productType: matchedData.productType,
          subCategories: matchedData.subCategories,

        });
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
  revalidatePath('/admin/products');
}
