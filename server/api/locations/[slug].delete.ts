import { removeLocationBySlug } from "~/lib/db/queries/location";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const locationToDelete = await removeLocationBySlug(slug, event.context.user.id);

  if (!locationToDelete) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location could not be deleted",
    }));
  }
  setResponseStatus(event, 204);
});
