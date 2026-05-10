"use client";

import { Noto_Sans_Thai_Looped, Bebas_Neue } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";

// 💡 เพิ่ม variable เพื่อนำไปใช้เป็น CSS Variable
const notoThai = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-noto-looped", // ตั้งชื่อตัวแปร
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas", // ตั้งชื่อตัวแปร
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      {/* 💡 ใส่ตัวแปร variable ลงไปใน className ของ body */}
      <body className={`
        ${notoThai.variable} 
        ${bebas.variable} 
        ${notoThai.className} 
        bg-[#E2E2E2] m-0 p-0 flex justify-center items-start min-h-screen
      `}>
        <div className="w-full max-w-[390px] min-h-screen bg-[#F5F0E6] shadow-2xl flex flex-col relative overflow-hidden">
          <NavigationWrapper />
          <main className="flex-1 w-full flex flex-col overflow-hidden min-h-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}