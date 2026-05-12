// app/components/CatGrid.tsx
"use client";

import React from "react";
import CatCard from "./CatCard";

interface CatGridProps {
  catIds: string[];
  onCatClick?: (id: string) => void;
}

export default function CatGrid({ catIds, onCatClick }: CatGridProps) {
  return (
    <div style={gridWrapper}>
      {catIds.map((id) => (
        <CatCard key={id} catId={id} onClick={onCatClick} />
      ))}
    </div>
  );
}

const gridWrapper: React.CSSProperties = {
  display: "grid",
  // ✨ ล็อคไว้ที่ 2 คอลัมน์สำหรับมือถือ ตามขนาด 161px ที่คุณล็อคไว้
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px", // ระยะห่างระหว่างการ์ด
  width: "100%",
  maxWidth: "340px", // 161+161 + gap นิดหน่อย จะพอดีกับจอมือถือทั่วไป
  margin: "0 auto", // จัดกึ่งกลางหน้าจอ
  padding: "10px 0 40px 0",
};
