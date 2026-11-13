import { ResetForm } from "./form";
export const dynamic = "force-dynamic";
export const metadata = {title:"ตั้งรหัสผ่านผู้ดูแล",robots:{index:false,follow:false}};
export default async function ResetPage({searchParams}:{searchParams:Promise<{token?:string}>}) {const {token}=await searchParams; return <ResetForm token={typeof token === "string" ? token : ""}/>;}
