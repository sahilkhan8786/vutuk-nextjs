import mongoose, { Types } from "mongoose";



const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [

      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        selectedSKU: {
          type: String,
          required: true
        },

        isSavedForLater: {
          type: Boolean,
          default: false,
        },
      }

    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
