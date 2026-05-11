"use client";

import { Noto_Sans_Thai_Looped, Bebas_Neue } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  weight: ["300","400", "700", "800", "900"],
  variable: "--font-noto-looped",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`
        ${notoThai.variable} 
        ${bebas.variable} 
        ${notoThai.className} 
        bg-[#E2E2E2] m-0 p-0 flex justify-center items-start min-h-screen
      `}>
        {/* ✨ แก้ไขจุดนี้: เอา bg-[#F5F0E6] ออก เพื่อไม่ให้สีทึบไปขัดขวางการเบลอ */}
        <div className="w-full max-w-[390px] min-h-screen shadow-2xl flex flex-col relative min-h-0">
          <main className="flex-1 w-full flex flex-col relative min-h-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}