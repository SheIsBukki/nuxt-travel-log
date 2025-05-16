import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),

  locationLogId: int()
    .notNull()
    .references(() => locationLog.id),
  userId: int()
    .notNull()
    .references(() => user.id),

  createdAt: int()
    .notNull()
    .$default(() => Date.now()),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});

export const locationLogImageRelations = relations(locationLogImage, ({ one }) => ({
  locationLog: one(locationLog, {
    fields: [locationLogImage.locationLogId],
    references: [locationLog.id],
  }),
}));

// Key regex explanation: the key should start with one or more digits——the userId, followed by a slash, another one or more digits——the location log id, followed by a slash, then a UUID with 32 characters broken into 8 characters, 4 characters three times, and 12 characters. and it ends in .jpg because that's the format we defined for the S3 bucket. If it doesnt match this pattern, the error message will be "Invalid key"
export const InsertLocationLogImage = createInsertSchema(locationLogImage, {
  key: field => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
}).omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocationLogImage = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogWithImage = typeof locationLogImage.$inferInsert;
