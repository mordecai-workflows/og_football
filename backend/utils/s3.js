import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const [region, accessKeyId, secretAccessKey, Bucket] = [
  process.env.AWS_REGION,
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_SECRET_ACCESS_KEY,
  process.env.AWS_BUCKET_NAME,
];

if (!region || !accessKeyId || !secretAccessKey || !Bucket) {
  throw new Error("Missing required env vars");
}

// Initialize S3 client (AWS SDK v3)
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function generatePresignedUrl(fileName, fileType) {
  if (!fileName || typeof fileName !== "string") {
    throw new Error('Missing or invalid "fileName" parameter');
  }
  if (!fileType || typeof fileType !== "string") {
    throw new Error('Missing or invalid "fileType" parameter');
  }

  const timestamp = Date.now();
  const key = `${timestamp}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return { uploadUrl, key };
}

export async function generateGetUrl(key) {
  if (!key || typeof key !== "string") {
    throw new Error("Missing or invalid key parameter");
  }

  const command = new GetObjectCommand({
    Bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // expires in 60 seconds
  return signedUrl;
}

export async function deleteObject(key) {
  if (!key || typeof key !== "string") {
    throw new Error("Missing or invalid key parameter");
  }

  const command = new DeleteObjectCommand({
    Bucket,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return { success: true, message: `Deleted ${key}` };
  } catch (error) {
    throw new Error(`Failed to delete object: ${error.message}`);
  }
}
