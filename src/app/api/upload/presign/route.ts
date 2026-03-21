import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
	},
});

export async function POST() {
	const requestHeaders = await headers();
	const session = await auth.api.getSession({ headers: requestHeaders });

	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const key = `uploads/${session.user.id}/${crypto.randomUUID()}.txt`;

	const url = await getSignedUrl(
		r2,
		new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME as string,
			Key: key,
			ContentType: "application/octet-stream",
		}),
		{ expiresIn: 600 },
	);

	return Response.json({ url, key });
}
