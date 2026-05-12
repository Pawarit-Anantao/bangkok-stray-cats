"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

interface MapToggleProps {
  mode: "official" | "community";
  onChange: (mode: "official" | "community") => void;
}

export default function MapToggle({ mode, onChange }: MapToggleProps) {
  // 🎨 สไตล์พื้นฐานสำหรับทั้งสองปุ่ม
  const baseButtonStyle: React.CSSProperties = {
    display: "flex",
    height: "28px",
    width: "100px",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontFamily: bebas.style.fontFamily,
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    cursor: "pointer",
    border: "none",
    padding: "5px 0",
    // 💡 ใส่ Animation กลับเข้าไปตรงนี้ครับ
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  // ⚪️ สไตล์ตอนเลือก (Active)
  const activeStyle: React.CSSProperties = {
    background: "#FFF",
    color: "#5180CE",
  };

  // 🔵 สไตล์ตอนไม่ได้เลือก (Inactive)
  const inactiveStyle: React.CSSProperties = {
    background: "#5180CE",
    color: "#FFF",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.25)",
        borderRadius: "32px",
        overflow: "hidden",
        background: "#5180CE", // 💡 เพิ่มสีพื้นหลังไว้กันสีขาวแวบตอนเปลี่ยน
      }}
    >
      {/* ปุ่ม OFFICIAL */}
      <button
        onClick={() => onChange("official")}
        style={{
          ...baseButtonStyle,
          ...(mode === "official" ? activeStyle : inactiveStyle),
          borderRadius: "32px 0 0 32px",
        }}
      >
        OFFICIAL
      </button>

      {/* ปุ่ม COMMUNITY */}
      <button
        onClick={() => onChange("community")}
        style={{
          ...baseButtonStyle,
          ...(mode === "community" ? activeStyle : inactiveStyle),
          borderRadius: "0 32px 32px 0",
        }}
      >
        COMMUNITY
      </button>
    </div>
  );
}
