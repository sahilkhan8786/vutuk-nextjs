import mongoose from "mongoose";
const favouriteProductSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref:"Product"
        }
    ]
});

const FavouriteProducts = mongoose.models.FavouriteProducts || mongoose.model("FavouriteProducts", favouriteProductSchema);

export default FavouriteProducts;
