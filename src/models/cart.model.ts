import { Schema, model, models } from 'mongoose';

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variants: [
    {
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      color: {
        type: String,
        required: true
      }
    }
  ]
});

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  cart: [cartItemSchema]
}, { timestamps: true });

const Cart = models.Cart || model('Cart', cartSchema);

export default Cart;