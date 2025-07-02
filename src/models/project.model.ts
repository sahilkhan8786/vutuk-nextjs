import mongoose from "mongoose";
import slugify from "slugify";

const projectsSchema = new mongoose.Schema({
  projectName: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, minlength: 5 },
  image: { type: String, required: false },
  stream: {
    type: String,
    enum: ["media", "design", "web-development"],
    default: "media",
  },
  contentType: {
    type: String,
    enum: ["data", "web"],
    required: true,
    trim: true,
    lowercase: true,
  },
  websiteUrl: { type: String, required: false },
  projectData: { type: [String], required: false },
  relatedToService: { type: String, required: false, minlength: 2, maxlength: 50 },
  slug: { type: String, unique: true },
});

projectsSchema.pre("save", function (next) {
  if (this.isModified("projectName") || !this.slug) {
    this.slug = slugify(this.projectName, { lower: true, strict: true });
  }
  next();
});

const Project = mongoose.models.Project || mongoose.model("Project", projectsSchema);
export default Project;
