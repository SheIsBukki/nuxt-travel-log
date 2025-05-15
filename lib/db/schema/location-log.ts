import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import {
  DescriptionSchema,
  LatitudeSchema,
  LongitudeSchema,
  NameSchema,
} from "~/lib/zod-schemas";

import { user } from "./auth";
import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),

  startedAt: int().notNull(),
  endedAt: int().notNull(),

  latitude: real().notNull(),
  longitude: real().notNull(),

  locationId: int()
    .notNull()
    .references(() => location.id),
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

// One-to-many relationship from the POV of the many
export const locationLogRelations = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

// Zod validated schema
export const InsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
})
  .omit({
    id: true,
    userId: true,
    locationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .superRefine((values, context) => {
    if (
      values.startedAt > values.endedAt
      || values.endedAt < values.startedAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start Date must be before End Date",
        path: ["startedAt"],
      });
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End Date must be after Start Date",
        path: ["endedAt"],
      });
    }
  });

export type SelectLocationLog = typeof locationLog.$inferSelect;
export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
