import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { toast } from "sonner";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const generateFileKey = (fileName: string, userId: string): string => {
  if (!fileName || !userId) {
    throw new Error("Invalid input: fileName and userId are required.");
  }

  const formattedFileName = fileName.replace(/[\s\u00A0\t]+/g, "-"); // Removes all spaces, tabs, and non-breaking spaces
  console.log("formattedFileName", formattedFileName);
  return `${userId}/${formattedFileName}`;
};
const getS3SignedURL = async (
  fileName: string,
  userId: string
): Promise<string | undefined> => {
  try {
    const fileKey = generateFileKey(fileName, userId);

    if (!fileKey) return;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: fileKey,
    });

    // Generate a signed url, valid for 60 seconds
    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60,
    });

    return signedUrl;
  } catch (error) {
    console.error(`Failed to generate signed URL for ${fileName}`, error);
  }
};

export const uploadFile = async (
  file: File,
  userId: string
): Promise<{ fileName: string; status: string }> => {
  let status: string = "SUCCESS"; // Default status

  try {
    const signedUrl = await getS3SignedURL(file.name, userId);

    if (!signedUrl) {
      toast.error(`Failed to upload ${file.name}`);
      status = "FAILED";
    } else {
      // Upload the file to S3 using the signed URL
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        toast.error(`Failed to upload ${file.name}`);
        status = "FAILED";
      }
    }
  } catch (error) {
    console.error(`Failed to upload ${file.name}`, error);
    status = "ERROR";
  } finally {
    return { fileName: file.name, status: status };
  }
};
