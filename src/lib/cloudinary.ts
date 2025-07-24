import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  

 export  async function optimizeImage(file: File,width?:number): Promise<Buffer> {
    const buffer = await fileToBuffer(file);
  
    const optimized = await sharp(buffer)
      .resize({ width: width?? 768, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
  
    if (optimized.length > 5 * 1024 * 1024) {
      throw new Error('Optimized image still too large. Try a smaller image.');
    }
  
    return optimized;
  }
  

  function slugifyFilename(name: string) {
    return name
      .toLowerCase()
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/[^a-z0-9-_]/g, '-') // replace invalid chars with hyphen
      .replace(/-+/g, '-') // collapse multiple hyphens
      .replace(/^-+|-+$/g, ''); // trim hyphens from ends
  }

export  async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
      
    const safeName = slugifyFilename(filename);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'your_folder_name', // optional
          public_id: safeName,
          resource_type: 'image',
          format: 'webp',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
  
      Readable.from(buffer).pipe(uploadStream);
    });
  }
  

  export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  
      if (result.result !== 'ok' && result.result !== 'not_found') {
        throw new Error(`Failed to delete image: ${result.result}`);
      }
    } catch (error) {
      console.error('Cloudinary deletion error:', error);
      throw error;
    }
  }
  
  

  export function extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const fileWithExt = parts.pop()!;
    const publicId = fileWithExt.split('.')[0];
    const folder = parts.slice(parts.indexOf('upload') + 1).join('/');
    return `${folder}/${publicId}`;
  }
  
  export async function uploadRawFileToCloudinary(file: File): Promise<string | null> {
    try {
      // Convert browser File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      // Upload via stream
      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "custom-3d-models",
            resource_type: "raw", // For STL, OBJ, STEP files
            upload_preset: "vutuk.dm", // Optional if using unsigned uploads
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result?.secure_url) {
              resolve(result.secure_url);
            } else {
              reject("No secure_url returned.");
            }
          }
        );
  
        Readable.from(buffer).pipe(uploadStream);
      });
  
      return uploadedUrl;
    } catch (error) {
      console.error("Server-side Cloudinary upload failed:", error);
      return null;
    }
  }
  