"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/server";
import { defaultContent } from "@/lib/default-content";
function validShape(value: unknown, sample: unknown, key = ""): boolean {
 if (typeof sample === "string") {
  if (typeof value !== "string" || value.length > 3000) return false;
  if (["image", "src", "logo"].includes(key) && value && !/^\/(?!\/)[^\\]*$/.test(value) && !/^https:\/\//i.test(value)) return false;
  return true;
 }
 if (Array.isArray(sample)) return Array.isArray(value) && value.length <= 100 && value.every(v => validShape(v, sample[0], key));
 if (sample && typeof sample === "object") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>, s = sample as Record<string, unknown>;
  return Object.keys(v).every(k => k in s) && Object.keys(s).every(k => validShape(v[k], s[k], k));
 }
 return false;
}
export async function login(_: string, form: FormData): Promise<string> {
 const auth = getAuth(); const username = process.env.ADMIN_USERNAME; const email = process.env.ADMIN_AUTH_EMAIL;
 if (!auth || !process.env.ADMIN_USER_ID || !username || !email) return "ยังไม่ได้ตั้งค่าบัญชีผู้ดูแล";
 if (String(form.get("username") || "").trim().toLowerCase() !== username.trim().toLowerCase()) return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
 const {data, error} = await auth.signIn.email({ email, password:String(form.get("password") || "") });
 if (error || !data?.user) return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
 if (data.user.id !== process.env.ADMIN_USER_ID) { await auth.signOut(); return "บัญชีนี้ไม่มีสิทธิ์ดูแลเว็บไซต์"; }
 redirect("/admin");
}
export async function logout() { const auth = getAuth(); if (auth) await auth.signOut(); redirect("/admin"); }
export async function saveContent(content: unknown): Promise<{ok: boolean; message: string}> {
 const auth = getAuth(); if (!auth || !process.env.ADMIN_USER_ID || !process.env.DATABASE_URL) return {ok:false,message:"ยังไม่ได้ตั้งค่าระบบ"};
 const {data:session,error} = await auth.getSession();
 if (error || !session?.user || session.user.id !== process.env.ADMIN_USER_ID) return {ok:false,message:"กรุณาเข้าสู่ระบบอีกครั้ง"};
 if (JSON.stringify(content).length > 250000 || !validShape(content, defaultContent)) return {ok:false,message:"ข้อมูลไม่ถูกต้อง โปรดตรวจสอบช่องข้อมูลและลิงก์รูปภาพ"};
 try { const sql=neon(process.env.DATABASE_URL); await sql`INSERT INTO site_content (id,content,updated_at) VALUES (1, ${JSON.stringify(content)}::jsonb, now()) ON CONFLICT (id) DO UPDATE SET content=EXCLUDED.content, updated_at=now()`; }
 catch { return {ok:false,message:"บันทึกไม่สำเร็จ โปรดตรวจสอบการเชื่อมต่อฐานข้อมูล"}; }
 revalidatePath("/"); revalidatePath("/admin"); return {ok:true,message:"บันทึกเรียบร้อยแล้ว"};
}
