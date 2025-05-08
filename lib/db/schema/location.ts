import type { z } from "zod";

import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

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

// Zod validated schema
export const InsertLocation = createInsertSchema(location, {
  name: field => field.min(1).max(100),
  description: field => field.max(1000),
  latitude: field => field.min(-90).max(90),
  longitude: field => field.min(-180).max(180),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocation = z.infer<typeof InsertLocation>;
