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
  

 export  async function optimizeImage(file: File): Promise<Buffer> {
    const buffer = await fileToBuffer(file);
  
    const optimized = await sharp(buffer)
      .resize({ width: 768, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
  
    if (optimized.length > 5 * 1024 * 1024) {
      throw new Error('Optimized image still too large. Try a smaller image.');
    }
  
    return optimized;
  }
  

export  async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'your_folder_name', // optional
          public_id: filename.split('.')[0],
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
  