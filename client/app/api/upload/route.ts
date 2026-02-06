import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
const PUBLIC_DOMAIN = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN; // Optionnel en dev

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = (formData.get('category') as string) || 'file';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = file.name.split('.').pop();
        const key = `${category}/${uuidv4()}.${fileExtension}`;

        const putCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            Metadata: {
                originalName: file.name,
                uploadDate: new Date().toISOString(),
            },
        });

        await s3Client.send(putCommand);

        let url: string;

        if (PUBLIC_DOMAIN) {

            url = `${PUBLIC_DOMAIN}/${key}`;
        } else {

            const getCommand = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
            });

            url = await getSignedUrl(s3Client, getCommand, {
                expiresIn: 7 * 24 * 60 * 60,
            });
        }

        return NextResponse.json({
            url,
            key,
            category,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}