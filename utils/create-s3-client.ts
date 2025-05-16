import { S3Client } from "@aws-sdk/client-s3";

import env from "~/lib/env";

export default function createS3Client() {
  return new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_ENDPOINT.includes("localhost"), // force the pathstyle if S3_ENDPOINT includes localhost, otherwise when running in production, it will include it as s subdoman
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
  });
}
