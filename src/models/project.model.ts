import mongoose, { UpdateQuery } from "mongoose";
import slugify from "slugify";

interface IProject {
  projectName: string;
  description: string;
  image?: string;
  stream?: string;
  contentType: "data" | "web";
  websiteUrl?: string;
  projectData?: string[];
  relatedToService?: string;
  slug?: string;
}

const projectsSchema = new mongoose.Schema<IProject>({
  projectName: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, required: true, minlength: 5 },
  image: { type: String, required: false },
  stream: { type: String, default: "media" },
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

// For create/save
projectsSchema.pre("save", function (next) {
  if (this.isModified("projectName") || !this.slug) {
    this.slug = slugify(this.projectName, { lower: true, strict: true });
  }
  next();
});

// For update
projectsSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as UpdateQuery<IProject>;

  if (update.projectName) {
    update.slug = slugify(update.projectName, { lower: true, strict: true });
    this.setUpdate(update);
  }

  // Handle case where $set is used
  if (update.$set && update.$set.projectName) {
    update.$set.slug = slugify(update.$set.projectName, { lower: true, strict: true });
  }

  next();
});

const Project = mongoose.models.Project || mongoose.model<IProject>("Project", projectsSchema);
export default Project;
