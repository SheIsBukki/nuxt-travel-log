import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod";

import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const MAX_CONTENT_LENGTH = 1024 * 1024 * 0.5; // 500kb

const ImageSchema = z.object({
  contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
  checksum: z.string(),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, ImageSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  // Calls the location log get API endpoint since it has the logic we need. We get the slug and id first though
  await event.$fetch(`/api/locations/${slug}/${id}`);

  const client = createS3Client();

  // When putting a file into an S3 bucket, it has a key and the key is the file path inside of the bucket. The storage approach for the users——we will create a folder for every user to store their images. and the folder will have the user's id. so this key is the user's id, the location log id, and the file name——we created a global unique identifer for the file name
  const fileName = crypto.randomUUID();
  const key = `${event.context.user.id}/${id}/${fileName}.jpg`;

  // The Expires option allows us to set a expiration for the Url the user will use to upload so that it is a one-and-done tyoe of url. Users should still have enoguh time to uplaad their images thoguh cos of latency and whatnot. So, that 120 means 120 seconds
  const { url, fields } = await createPresignedPost(client, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Expires: 120,
    Fields: { "x-amz-checksum-sha256": result.data.checksum },
    Conditions: [
      [
        "content-length-range",
        result.data.contentLength,
        result.data.contentLength,
      ],
      ["eq", "$x-amz-meta-user-id", event.context.user.id.toString()],
      ["eq", "$x-amz-meta-location-log-id", id],
    ],
  });

  fields["x-amz-meta-user-id"] = event.context.user.id.toString();
  fields["x-amz-meta-location-log-id"] = id;

  return { url, fields, key };
});
