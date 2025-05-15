import { and, eq } from "drizzle-orm";

import type { InsertLocationLog } from "~/lib/db/schema";

import db from "~/lib/db";
import { locationLog } from "~/lib/db/schema";

export async function insertLocationLog(
  locationId: number,
  insertable: InsertLocationLog,
  userId: number,
) {
  const [insertedLog] = await db
    .insert(locationLog)
    .values({ ...insertable, locationId, userId })
    .returning();

  return insertedLog;
}

export async function findLocationLog(id: number, userId: number) {
  const foundLog = await db.query.locationLog.findFirst({
    where: and(eq(locationLog.id, id), eq(locationLog.userId, userId)),
  });

  return foundLog;
}
