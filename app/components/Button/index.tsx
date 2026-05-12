"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties; // สำหรับรับ flex: 1 จาก parent
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // 💡 รวมสไตล์ที่ส่งมา + บังคับใช้ฟอนต์ Noto Looped Thai ขนาด 14px ตรงนี้เลย
      // 💡 โดยไม่ต้องไปแก้ tailwind config
      style={{
        ...style,
        fontFamily: "'Noto Looped Thai', sans-serif",
        fontSize: "14px", // 📏 ขนาดประมาณ 14px ตามต้องการ
        fontWeight: "normal", // ✅ รักษาความหนาไว้เพื่อให้ปุ่มเด่น
      }}
      className={`
        flex items-center justify-center
        min-w-[162px] px-6 py-[10px] rounded-[24px]
        border-2 border-[#655E4C]
        text-black 
        transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          variant === "primary"
            ? "bg-[#FFFAF0] hover:bg-[#EEE5D0] active:bg-[#DDD4BC]"
            : "bg-transparent hover:bg-[#655E4C]/10 active:bg-[#655E4C]/20"
        }
        ${className}
      `}
    >
      {/* ⚠️ ลบ font-thai, font-noto และ text-2xl ออกจาก className แล้ว */}
      {children}
    </button>
  );
}
