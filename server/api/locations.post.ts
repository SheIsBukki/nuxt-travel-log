import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  // If the user is not logged in, they can't add locations
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorised",

    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}:  ${issue.message}`).join("; ");

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;

      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  // Database insertion
  const existingLocation = await db.query.location.findFirst({
    where: and(eq(location.name, result.data.name), eq(location.userId, event.context.user.id)),
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "You have already created a location with the same name!",

    }));
  }

  let slug = slugify(result.data.name);
  let existingSlug = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existingSlug) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;

    existingSlug = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));

    if (!existingSlug) {
      slug = idSlug;
    }
  }

  try {
    const [createdLocation] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();

    return createdLocation;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Location name must be unique. ",
      }));
    }

    throw error;
  }
});
