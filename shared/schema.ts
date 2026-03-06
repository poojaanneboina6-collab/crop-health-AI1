import { pgTable, text, serial, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  language: text("language").notNull(),
  diseaseName: text("disease_name").notNull(),
  diseaseConfidence: doublePrecision("disease_confidence").notNull(),
  treatment: text("treatment").notNull(),
  supplierName: text("supplier_name").notNull(),
  supplierAddress: text("supplier_address").notNull(),
  translatedOutput: text("translated_output"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ id: true, createdAt: true });

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
