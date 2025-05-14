import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { DescriptionSchema, LatitudeSchema, LongitudeSchema, NameSchema } from "~/lib/zod-schemas";

import type { SelectLocationLog } from "./location-log";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  latitude: real().notNull(),
  longitude: real().notNull(),

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
}, t => [
  unique().on(t.name, t.userId),
]);

// One-to-many relationship. The instructor thinks it is necessary or perhaps it is necessary for sqlite. I'm new to sqlite, I use postgresql
export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}));

// Zod validated schema
export const InsertLocation = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocation = z.infer<typeof InsertLocation>;
export type SelectLocation = typeof location.$inferSelect;
export type SelectLocationWithLogs = SelectLocation & { locationLogs: SelectLocationLog[] };
