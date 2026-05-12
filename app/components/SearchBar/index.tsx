"use client";

import React from "react";

interface SearchTag {
  key: string;
  label_th: string;
  category: string;
}

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  selectedTags: SearchTag[];
  onRemoveTag: (key: string) => void;
  onOpenFilter: () => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "ค้นหาชื่อน้องแมว...",
  value,
  onChange,
  selectedTags,
  onRemoveTag,
  onOpenFilter,
  className = "",
}: SearchBarProps) {
  return (
    <div className={className} style={mainWrapper}>
      {/* 🔍 ช่อง Search หลัก */}
      <div style={barContainerStyle}>
        <div style={iconLeftStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="#8F8362" strokeWidth="2" />
            <path
              d="M20 20L17 17"
              stroke="#8F8362"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
      </div>

      {/* 🏷️ ส่วนแสดงผล Tag และปุ่มเลือกแท็ก (รวมกลุ่มกันที่ด้านขวา) */}
      <div style={tagAreaWrapper}>
        {/* คอนเทนเนอร์เก็บ Tag ที่เลือกแล้ว จะแสดงอยู่ข้างๆ ปุ่ม */}
        <div style={tagsContainer}>
          {selectedTags.map((tag) => (
            <div key={tag.key} style={selectedTagCapsule}>
              <span style={tagLabelText}>{tag.label_th}</span>
              <button
                onClick={() => onRemoveTag(tag.key)}
                style={removeBtnStyle}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ปุ่มเลือกแท็ก ขนาดเท่ากับ Tag Capsule */}
        <button onClick={onOpenFilter} style={filterBtnCapsule}>
          เลือกแท็ก
        </button>
      </div>
    </div>
  );
}

// --- 🎨 Styles (ปรับขนาดและตำแหน่งใหม่) ---
const FONT_VAR = "var(--font-noto-looped)";

const mainWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "336px",
  margin: "0 auto",
};

const barContainerStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  height: "42px",
  alignItems: "center",
  position: "relative",
  borderRadius: "32px",
  border: "1px solid #8F8362",
  background: "#FFF",
  overflow: "hidden",
};

const iconLeftStyle: React.CSSProperties = {
  paddingLeft: "15px",
  display: "flex",
  alignItems: "center",
};
const inputStyle: React.CSSProperties = {
  flex: 1,
  height: "100%",
  border: "none",
  outline: "none",
  padding: "0 15px",
  fontSize: "14px",
  color: "#8F8362",
  background: "transparent",
  fontFamily: FONT_VAR,
};

// จัดวางให้อยู่ขวา และให้ Tag ไหลออกมาจากทางซ้ายของปุ่ม
const tagAreaWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "5px",
  width: "100%",
  overflow: "hidden", // กัน Tag ล้นบรรทัด
};

const tagsContainer: React.CSSProperties = {
  display: "flex",
  gap: "5px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  justifyContent: "flex-end",
  alignItems: "center",
};

const commonCapsule: React.CSSProperties = {
  display: "flex",
  height: "15px",
  padding: "10px 10px",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  borderRadius: "32px",
  background: "#EBE4D5",
  flexShrink: 0,
  boxSizing: "border-box",
};

const filterBtnCapsule: React.CSSProperties = {
  ...commonCapsule,
  border: "0.7px solid #FF146E",
  cursor: "pointer",
  fontSize: "9px",
  fontFamily: FONT_VAR,
  color: "#FF146E",
};

const selectedTagCapsule: React.CSSProperties = {
  ...commonCapsule,
  border: "0.5px solid #8F8362",
};

const tagLabelText: React.CSSProperties = {
  fontSize: "9px",
  fontFamily: FONT_VAR,
  color: "#8F8362",
};

const removeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontSize: "9px",
  color: "#8F8362",
  display: "flex",
  alignItems: "center",
};
