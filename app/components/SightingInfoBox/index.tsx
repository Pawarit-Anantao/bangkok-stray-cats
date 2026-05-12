"use client";

import Link from "next/link"; // 💡 นำเข้า Link สำหรับทำปุ่มกดเปลี่ยนหน้า

export interface CatLocationData {
  id: string;
  district: string;
  fullAddress: string;
}

interface SightingInfoBoxProps {
  sightingData?: CatLocationData;
  title?: string;
  actionText?: string;
  actionUrl?: string;
}

export default function SightingInfoBox({
  sightingData,
  title = "การพบล่าสุด", // ค่าเริ่มต้น (ถ้าไม่ส่ง prop มา จะใช้คำนี้)
  actionText = "ข้อมูลการพบทั้งหมด", // ค่าเริ่มต้น
  actionUrl = "/all-sightings", // ค่าเริ่มต้น URL
}: SightingInfoBoxProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-[12px]">
      {/* แถวหัวข้อ */}
      <div className="flex items-center self-stretch justify-between w-full">
        {/* ใช้ตัวแปร title แทนข้อความตายตัว */}
        <div className="flex justify-center items-center gap-[10px] text-[#000] text-[20px] font-normal leading-normal">
          {title}
        </div>

        {/* 💡 3. ใช้ <Link> แทน <div> เปล่าๆ เพื่อให้กดเปลี่ยนหน้าเว็บได้จริงๆ และรองรับ SEO */}
        <Link
          href={actionUrl}
          className="flex-1 text-[#8F8362] text-right text-[13px] font-normal leading-normal cursor-pointer hover:underline hover:text-[#FF146E] transition-colors"
        >
          {actionText}
        </Link>
      </div>

      {/* กล่องข้อความ */}
      <div className="flex self-stretch min-h-[28px] pt-[6px] pb-[15px] px-[15px] rounded-[12px] border-2 border-[#D2CCBB] bg-[#F7F7F7]">
        <p className="w-full text-[#000] text-[14px] font-normal leading-normal break-words">
          {/* 💡 4. การดักจับ (Fallback): ถ้าข้อมูลว่างเปล่า ให้แสดงคำว่า "ไม่ระบุข้อมูลตำแหน่ง" แทนการปล่อยเป็นหน้าจอโล่งๆ หรือ error */}
          {sightingData
            ? `${sightingData.district} ${sightingData.fullAddress}`
            : "ไม่มีข้อมูลตำแหน่งที่พบ"}
        </p>
      </div>
    </div>
  );
}
