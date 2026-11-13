"use server";
import { getAuth } from "@/lib/auth/server";
export async function requestReset(_:string, form:FormData):Promise<string> {
 const auth=getAuth(); const email=process.env.ADMIN_AUTH_EMAIL;
 if (!auth || !email) return "ระบบยังไม่พร้อมใช้งาน";
 const {error}=await auth.requestPasswordReset({email,redirectTo:"https://macro-wine.vercel.app/admin/reset"});
 return error ? "ส่งลิงก์ไม่สำเร็จ โปรดติดต่อผู้ดูแลระบบ" : "หากระบบส่งอีเมลสำเร็จ โปรดตรวจสอบกล่องจดหมายของบริษัทและกดลิงก์ตั้งรหัสผ่าน";
}
export async function resetPassword(_:string, form:FormData):Promise<string> {
 const auth=getAuth(); const token=String(form.get("token") || ""); const password=String(form.get("password") || ""); const confirm=String(form.get("confirm") || "");
 if(!auth || !token) return "ลิงก์ไม่ถูกต้องหรือหมดอายุ";
 if(password.length < 12 || password.length > 128 || password !== confirm) return "รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษรและตรงกันทั้งสองช่อง";
 const {error}=await auth.resetPassword({newPassword:password,token});
 return error ? "ตั้งรหัสผ่านไม่สำเร็จ โปรดขอลิงก์ใหม่" : "ตั้งรหัสผ่านเรียบร้อยแล้ว สามารถกลับไปเข้าสู่ระบบได้";
}
