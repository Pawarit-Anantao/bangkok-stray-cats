"use client";

import React from "react";

interface CategoryGridProps {
  onOpenSelector: (categoryId: string) => void;
  selectedCounts: { [key: string]: number };
}

export default function CategoryGrid({
  onOpenSelector,
  selectedCounts,
}: CategoryGridProps) {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";

  const categories = [
    { id: "pattern", label: "เลือกลาย" },
    { id: "color", label: "เลือกสี" },
    { id: "fur_length", label: "ลักษณะขน" },
    { id: "size", label: "ขนาด" },
    { id: "gender", label: "เพศ" },
    { id: "health", label: "ข้อมูลสุขภาพ" },
  ];

  return (
    <div style={gridContainerStyle}>
      {categories.map((cat) => {
        const isSelected = selectedCounts[cat.id] > 0;

        return (
          <button
            key={cat.id}
            onClick={() => onOpenSelector(cat.id)}
            style={{
              ...buttonBaseStyle,
              border: isSelected
                ? "1.5px solid #8F8362"
                : "1.5px solid #D2CCBB",
            }}
          >
            <span style={{ fontFamily: FONT_VARIABLE }}>{cat.label}</span>
            {/* ⬇️ ปรับขนาดไอคอนให้เล็กลงเหลือ 14 เพื่อให้ปุ่มเตี้ยลงได้จริง */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// --- 🎨 Styles (ปรับจูนให้จิ๋วแต่สมดุล) ---

const gridContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px", // ✨ ใช้ 6px เพื่อไม่ให้ปุ่มติดกันเกินไปจนดูเป็นก้อนเดียว
  width: "100%",
};

const buttonBaseStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 12px", // ✨ ปรับเป็น 4px เพื่อให้ดูเตี้ยแต่ไม่บี้
  borderRadius: "10px", // ✨ ลดมนลงนิดหน่อยให้เข้ากับขนาดจิ๋ว
  background: "#F7F7F7",
  cursor: "pointer",
  fontSize: "13px", // ✨ ใช้ 13px เป็นขนาดมาตรฐานที่ "เล็กแต่ยังอ่านออก"
  color: "#333",
  transition: "all 0.2s ease",
  outline: "none",
  boxSizing: "border-box",
  minHeight: "28px", // ✨ ล็อคความสูงขั้นต่ำไว้ที่ 28px (ขนาดกำลังสวยสำหรับปุ่มจิ๋ว)
};
