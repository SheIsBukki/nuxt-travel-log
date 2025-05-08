import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocation } from "~/lib/db/schema";

import db from "~/lib/db";
import { location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findLocations(userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findLocationByName(existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(eq(location.name, existing.name), eq(location.userId, userId)),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existingSlug = !!(await findLocationBySlug(slug));

  while (existingSlug) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;

    existingSlug = !!(await findLocationBySlug(idSlug));

    if (!existingSlug) {
      return idSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [createdLocation] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  return createdLocation;
}
