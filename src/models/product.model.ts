import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({}, { strict: false });


// CATEGORY [string,string]
// SUBCATEGORY [string]
// discount


// CREATE COUPON FUNCTIONALITY

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;