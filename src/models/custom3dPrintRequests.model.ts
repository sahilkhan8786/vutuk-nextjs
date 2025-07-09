import mongoose, { Schema, Document, model } from 'mongoose';

export interface ICustom3DPrintRequest extends Document {
  userId: mongoose.Types.ObjectId | null;
  modelFileUrl?: string;
  material: string;
  otherMaterial?: string;
  color: string;
  otherColor?: string;
  priority: string;
  otherPriority?: string;
  quantity: number;
  notes?: string;
  isBusiness: boolean;
  gstOrFirm?: string;
  status: Custom3DPrintStatus;
  image?: string;
  price?: number;
  trackingId?: string;
  youtubeLink?: string;
  customRequest: boolean;

  // ✅ New Fields for Dimensions
  length?: number;
  breadth?: number;
  height?: number;
  dimensionUnit?: string;

  createdAt: Date;
  updatedAt: Date;
}

const STATUS_ENUM = [
  'Request Submitted',
  'Under Verification',
  'Quotation Generated',
  'In Production',
  'Out for Delivery',
  'Delivered',
] as const;

export type Custom3DPrintStatus = typeof STATUS_ENUM[number];

const Custom3dPrintSchema = new Schema<ICustom3DPrintRequest>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    youtubeLink: {
      type: String,
      default: '',
    },
    trackingId: {
      type: String,
      default: '',
    },
    modelFileUrl: String,
    material: { type: String, required: true },
    otherMaterial: String,
    color: { type: String, required: true },
    otherColor: String,
    priority: { type: String, required: true },
    otherPriority: String,
    quantity: { type: Number, required: true, min: 1 },
    notes: String,
    isBusiness: { type: Boolean, required: true },
    gstOrFirm: String,

    // ✅ Dimensions
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    dimensionUnit: { type: String, default: 'mm' },

    customRequest: {
      type:Boolean,
      default:true
      
    },

    status: {
      type: String,
      enum: STATUS_ENUM,
      default: 'Request Submitted',
    },
  },
  {
    timestamps: true,
  }
);

const Custom3dPrintRequest =
  mongoose.models.Custom3dPrintRequest ||
  model<ICustom3DPrintRequest>('Custom3dPrintRequest', Custom3dPrintSchema);

export default Custom3dPrintRequest;
