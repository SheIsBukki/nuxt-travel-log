import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { deleteLocationLogImage } from "~/lib/db/queries/location-log-image";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const imageId = getRouterParam(event, "image-id") as string;

  if (!z.coerce.number().safeParse(imageId).success) {
    return sendError(
      event,
      createError({
        statusCode: 422,
        statusMessage: "Invalid image id",
      }),
    );
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  // Calls the location log get API endpoint since it has the logic we need. We get the slug and id first though
  await event.$fetch(`/api/locations/${slug}/${id}`);

  const imageToDelete = await deleteLocationLogImage(
    Number(imageId),
    event.context.user.id,
  );

  // Removes it from the S3 Bucket
  if (imageToDelete) {
    const client = createS3Client();

    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: imageToDelete.key, // The image key this time is provided by the database
    });

    await client.send(command);
  }

  setResponseStatus(event, 204);
});
