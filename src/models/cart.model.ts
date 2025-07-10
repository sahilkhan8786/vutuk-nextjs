import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
