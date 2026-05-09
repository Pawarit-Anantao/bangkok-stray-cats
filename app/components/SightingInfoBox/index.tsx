"use client";

export interface CatLocationData {
  id: string;
  district: string;
  fullAddress: string;
}

interface SightingInfoBoxProps {
  sightingData: CatLocationData;
}

export default function SightingInfoBox({ sightingData }: SightingInfoBoxProps) {
  return (
    <div className="flex flex-col items-start gap-[12px] w-full max-w-[334px]">
      
      {/* แถวหัวข้อ */}
      <div className="flex items-center self-stretch justify-between w-full">
        
        <div className="flex justify-center items-center gap-[10px] text-[#000] text-[20px] font-normal leading-normal">
          การพบล่าสุด
        </div>

        <div className="flex-1 text-[#8F8362] text-right text-[13px] font-normal leading-normal cursor-pointer hover:underline">
          ข้อมูลการพบทั้งหมด
        </div>
        
      </div>

      {/* 💡 กล่องข้อความ: 
          - เอา items-center, justify-center ออก เพื่อให้ Padding ทำงาน 100%
          - ใส่ pt-[6px] (บน 6), pb-[32px] (ล่าง 32), px-[20px] (ซ้ายขวา 20)
      */}
      <div className="flex self-stretch min-h-[28px] pt-[6px] pb-[15px] px-[15px] rounded-[12px] border-2 border-[#D2CCBB] bg-[#F7F7F7]">
        
        <p className="w-full text-[#000] text-[14px] font-normal leading-normal break-words">
          {sightingData.district} {sightingData.fullAddress}
        </p>
        
      </div>
    </div>
  );
}