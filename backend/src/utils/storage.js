const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

let s3Client = null;

const isConfigured = () => {
  return !!(
    process.env.S3_BUCKET_NAME &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_ACCESS_KEY
  );
};

const getClient = () => {
  if (!s3Client && isConfigured()) {
    s3Client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

const uploadFile = async (file, category = "img") => {
  const client = getClient();
  if (!client) {
    throw new Error("S3 storage is not configured.");
  }

  const ext = path.extname(file.originalname);
  const key = `${category}/${crypto.randomUUID()}${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  const url = publicDomain
    ? `${publicDomain}/${key}`
    : `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || "auto"}.amazonaws.com/${key}`;

  return { url, key };
};

const deleteFile = async (key) => {
  const client = getClient();
  if (!client) return;

  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
  );
};

module.exports = { isConfigured, uploadFile, deleteFile };
