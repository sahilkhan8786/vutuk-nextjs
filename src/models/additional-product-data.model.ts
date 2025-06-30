import mongoose from 'mongoose';

const additionalproductDataSchema = new mongoose.Schema({}, { strict: false });

const AdditionalProductData = mongoose.models.AdditionalProductData || mongoose.model("AdditionalProductData", additionalproductDataSchema);

export default AdditionalProductData;