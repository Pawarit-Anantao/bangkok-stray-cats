"use client";

import NavigationWrapper from "../components/NavigationWrapper";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-[#F5F0E6] flex flex-col min-h-0">
      {/* ใส่ Navbar กลับมาเฉพาะกลุ่มนี้ */}
      <NavigationWrapper />
      
      {/* ส่วนเนื้อหาของหน้าต่างๆ (หน้าแผนที่, หน้า Add) */}
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}