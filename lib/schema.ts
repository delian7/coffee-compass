import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains unchanged
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Venue schema for coffee shops, restaurants, and bars
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'coffee', 'restaurant', 'bar'
  description: text("description").notNull(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count"),
  priceLevel: text("price_level"), // '$', '$$', '$$$'
  openingHours: text("opening_hours"),
  phoneNumber: text("phone_number"),
  website: text("website"),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  distance: doublePrecision("distance"), // Calculated field, not stored in DB
});

export const insertVenueSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  rating: z.number().nullable(),
  reviewCount: z.number().nullable(),
  priceLevel: z.string().nullable(),
  openingHours: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  website: z.string().nullable(),
  imageUrl: z.string().nullable(),
  tags: z.array(z.string()).nullable()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;
