"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card,CardContent } from "@/components/ui/card";
import { requestReset, resetPassword } from "./actions";
export function ResetForm({token}:{token:string}) {
 const [message,action,pending]=useActionState(token ? resetPassword : requestReset, "");
 return <main className="admin-shell admin-login"><Card><CardContent><h1>ตั้งรหัสผ่านผู้ดูแล</h1><p>{token ? "ตั้งรหัสผ่านใหม่ที่มีอย่างน้อย 12 ตัวอักษร" : "ส่งลิงก์ตั้งรหัสผ่านไปยังอีเมลบริษัทที่ลงทะเบียนไว้"}</p><form action={action}>{token && <><input type="hidden" name="token" value={token}/><label className="admin-field"><span>รหัสผ่านใหม่</span><input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><label className="admin-field"><span>ยืนยันรหัสผ่าน</span><input name="confirm" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label></>}{message && <p role="status">{message}</p>}<Button type="submit" disabled={pending}>{pending ? "กำลังดำเนินการ..." : token ? "ตั้งรหัสผ่าน" : "ส่งลิงก์ไปยังอีเมลบริษัท"}</Button></form></CardContent></Card></main>;
}
