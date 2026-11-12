import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "โชคนที 2019 | บริการให้เช่ารถแบ็คโฮ", description: "บริการให้เช่ารถแบ็คโฮ ห้างหุ้นส่วนจำกัด โชคนที 2019 ติดต่อสอบถามรถและประเมินหน้างาน" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body>{children}</body></html>; }
