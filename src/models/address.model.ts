import mongoose, { Schema, model, Document } from 'mongoose'

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId | null;
  requestId: mongoose.Types.ObjectId | null;
  firstName: string
  lastName: string
  email: string
  countryCode: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  country: string
  state: string
  city: string
  pinCode: string
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<IAddress>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true },
}, {
  timestamps: true,
})

const Address = mongoose.models.Address || model<IAddress>('Address', AddressSchema)

export default Address
