import { getAuth } from "@/lib/auth/server";
import { getContent } from "@/lib/content";
import { AdminEditor, LoginForm } from "./editor";
export const dynamic = "force-dynamic";
export const metadata = { title: "จัดการเว็บไซต์ | โชคนที 2019", robots: { index: false, follow: false } };
export default async function AdminPage() {
 const auth=getAuth();
 if (!auth || !process.env.ADMIN_USER_ID || !process.env.ADMIN_USERNAME || !process.env.ADMIN_AUTH_EMAIL || !process.env.DATABASE_URL) return <main className="admin-shell"><h1>ตั้งค่าระบบหลังบ้าน</h1><p>กรุณาตั้งค่าบัญชีผู้ดูแลตาม README ก่อนใช้งาน</p></main>;
 const {data:session}=await auth.getSession();
 if (!session?.user || session.user.id !== process.env.ADMIN_USER_ID) return <LoginForm />;
 return <AdminEditor initial={await getContent(true)} email={session.user.email || ""} />;
}
