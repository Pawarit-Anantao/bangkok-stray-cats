"use client";

import React from "react";

interface AggressivenessSelectorProps {
  selectedLevel: string | null;
  onSelect: (level: string) => void;
}

export default function AggressivenessSelector({
  selectedLevel,
  onSelect,
}: AggressivenessSelectorProps) {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";

  const levels = [
    { id: "very_friendly", label: "เชื่องมาก", color: "#4CAF50" }, // เขียว
    { id: "chill", label: "เชื่อง", color: "#8BC34A" }, // เขียวอ่อน
    { id: "normal", label: "ปกติ", color: "#FFC107" }, // เหลือง
    { id: "timid", label: "ขี้กลัว", color: "#FF9800" }, // ส้ม
    { id: "fierce", label: "ดุ", color: "#F44336" }, // แดง
  ];

  return (
    <div style={{ marginTop: "24px", width: "100%" }}>
      {/* 🏷️ Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            fontFamily: FONT_VARIABLE,
            margin: 0,
          }}
        >
          ประสบการณ์ความดุ
        </h2>
        <span
          style={{
            fontSize: "11px",
            color: "#8F8362",
            fontFamily: FONT_VARIABLE,
          }}
        >
          ไม่บังคับ
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#F7F7F7",
          padding: "16px 8px",
          borderRadius: "16px",
          border: "1.5px solid #D2CCBB",
        }}
      >
        {levels.map((level) => {
          const isActive = selectedLevel === level.id;

          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                flex: 1,
                transition: "all 0.2s ease",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: isActive ? "none" : "grayscale(100%) opacity(40%)", // เปลี่ยนเป็นขาวดำถ้าไม่ได้เลือก
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src={`/${level.id}.svg`} // ดึงจาก public/
                  alt={level.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/*Label */}
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: FONT_VARIABLE,
                  color: isActive ? level.color : "#A0A0A0", // เปลี่ยนสีตัวอักษรตามระดับ
                }}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
