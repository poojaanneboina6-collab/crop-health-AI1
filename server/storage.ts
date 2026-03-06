import { db } from "./db";
import {
  scans,
  recommendations,
  type InsertScan,
  type Scan,
  type InsertRecommendation,
  type Recommendation
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getScans(): Promise<Scan[]>;
  getScan(id: number): Promise<Scan | undefined>;
  createScan(scan: InsertScan): Promise<Scan>;
  
  getRecommendations(): Promise<Recommendation[]>;
  createRecommendation(rec: InsertRecommendation): Promise<Recommendation>;
}

export class DatabaseStorage implements IStorage {
  async getScans(): Promise<Scan[]> {
    return await db.select().from(scans).orderBy(desc(scans.createdAt));
  }

  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async createScan(scan: InsertScan): Promise<Scan> {
    const [created] = await db.insert(scans).values(scan).returning();
    return created;
  }

  async getRecommendations(): Promise<Recommendation[]> {
    return await db.select().from(recommendations).orderBy(desc(recommendations.createdAt));
  }

  async createRecommendation(rec: InsertRecommendation): Promise<Recommendation> {
    const [created] = await db.insert(recommendations).values(rec).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
