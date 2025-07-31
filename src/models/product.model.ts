import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    price: {
        type: Number,
        select: false
    },
    priceInUSD: {
        type: Number,
        select: false,
        default: 0
    },
}, { strict: false });


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;