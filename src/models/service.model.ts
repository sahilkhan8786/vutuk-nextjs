import mongoose from "mongoose";
import slugify from "slugify";

const servicesSchema = new mongoose.Schema({
    servicename: {
        type: String,
        trim: true,
        lower: true,
        required: [true, "Please provide user name"],
    },
    image: {
        type: String,
        required: [true, "Please provide the Image of the member"]
    },
    description: {
        type: String,
        trim: true,
        lower: true,
        required: [true, "Please provide a User Bio"],
    },
    stream: {
        type: String,
        enum: ["media", "design", "web-development"],
        required: [true, "Please provide a stream"],
    },
    slug: {
        type: String,
        unique: true,
      },
   

});

// Generate slug using slugify before saving
servicesSchema.pre("save", function (next) {
    if (this.isModified("servicename") || !this.slug) {
      this.slug = slugify(this.servicename, { lower: true, strict: true });
    }
    next();
  });

const Service = mongoose.models.Service || mongoose.model("Service", servicesSchema);

export default Service;