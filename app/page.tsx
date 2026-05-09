"use client";
import { useState } from "react";
import Button from "./components/Button";
import dynamic from "next/dynamic";
import MapToggle from "./components/MapToggle"; // ตรวจสอบ path ให้ตรงกับที่คุณเซฟไว้นะครับ

const Map = dynamic(() => import("./components/Map"), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      กำลังโหลดแผนที่ 🗺️...
    </div>
  ),
});

export default function Home() { 
  const [mapMode, setMapMode] = useState<"official" | "community">("community");

  return (
    <div className="flex flex-col w-full h-full flex-1 gap-[15px]">

      <div className="w-full h-[60dvh] shrink-0 bg-[#E8E4D9] border-b-2 border-[#D2CCBB] relative z-0">
        <Map />

        <div className="absolute top-[16px] left-[16px] z-[10px]">
          <MapToggle 
            mode={mapMode} 
            onChange={(newMode) => {
              setMapMode(newMode);
              console.log("เปลี่ยนโหมดเป็น:", newMode);
            }} 
          />
        </div>

      </div>

      

      <div className="w-full flex flex-col items-center p-4 gap-[6px] ">
      

        <Button onClick={() => console.log("กด!")}>ยืนยันการเพิ่มข้อมูล</Button>

        <div className="flex w-full justify-center gap-[5px]">
          <Button variant="ghost" >ยกเลิก</Button>
          <Button >ยืนยันการเพิ่มข้อมูล</Button>
        </div>


      </div>

    </div>
  );
}