import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema({
    productType: String,
    mainCategories: String,
    subCategories: String
});

const ProductTypes = mongoose.models.ProductTypes || mongoose.model("ProductTypes", productTypeSchema);

export default ProductTypes;