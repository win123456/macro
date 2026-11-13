import { neon } from "@neondatabase/serverless";
import { defaultContent } from "@/lib/default-content";
export type SiteContent = typeof defaultContent;
export async function getContent(strict = false): Promise<SiteContent> {
 if (!process.env.DATABASE_URL) { if (strict) throw new Error("ไม่ได้ตั้งค่า DATABASE_URL"); return defaultContent; }
 try {
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS site_content (id integer PRIMARY KEY CHECK (id = 1), content jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
  const rows = await sql`SELECT content FROM site_content WHERE id = 1`;
  return rows.length ? rows[0].content as SiteContent : defaultContent;
 } catch (error) { console.error("Unable to read site content", error); if (strict) throw new Error("ไม่สามารถอ่านข้อมูลเว็บไซต์ได้ โปรดตรวจสอบการเชื่อมต่อฐานข้อมูล"); return defaultContent; }
}
