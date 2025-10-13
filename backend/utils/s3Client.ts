import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET_NAME!;

if (!REGION || !BUCKET) {
  throw new Error("Missing S3 config in env (AWS_REGION or S3_BUCKET_NAME)");
}

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadBufferToS3 = async (buffer: Buffer, key: string, contentType: string) => {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await s3Client.send(cmd);
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

export const deleteFromS3 = async (key: string) => {
  const cmd = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3Client.send(cmd);
};

/**
 * Extracts the object key (path) from an S3 URL
 * e.g. https://my-bucket.s3.ap-south-1.amazonaws.com/folder/image.png
 * → returns "folder/image.png"
 */
export const getKeyFromUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;

    // If bucket name is part of the path (path-style URLs)
    if (path.startsWith(process.env.S3_BUCKET_NAME! + "/")) {
      return path.replace(`${process.env.S3_BUCKET_NAME!}/`, "");
    }

    return path;
  } catch {
    throw new Error(`Invalid S3 URL: ${url}`);
  }
};
