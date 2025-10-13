import { Express } from "express";
import { uploadBufferToS3 } from "./s3Client";

export async function handleFileUpload(
  file: Express.Multer.File | undefined,
  folder: string = "recipes"
): Promise<string | null> {
  if (!file) return null;

  // Sanitize the file name
  const safeName = file.originalname.replace(/\s+/g, "_");

  // Create unique S3 key
  const key = `${folder}/${Date.now()}-${safeName}`;

  // Upload buffer to S3 and return URL
  const imageUrl = await uploadBufferToS3(file.buffer, key, file.mimetype);
  return imageUrl;
}
