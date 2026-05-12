"use client";

import React from "react";

interface CatPawsProps {
  isActive?: boolean;
  size?: "small" | "large";
  onClick?: (e: React.MouseEvent) => void;
}

export default function CatPaws({ 
  isActive = false, 
  size = "small", 
  onClick 
}: CatPawsProps) {
  
  // 📏 คำนวณขนาดตาม Props
  const dimension = size === "small" ? 32 : 70;
  const svgWidth = size === "small" ? 20 : 44; // สเกลขนาดไอคอนตามปุ่ม
  const svgHeight = size === "small" ? 16 : 35;
  
  // 🎨 กำหนดสีและ Filter ตามสถานะ
  const activeColor = "#FF829E";
  const inactiveColor = "#A5A5A5";
  const iconColor = isActive ? activeColor : inactiveColor;
  
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    width: `${dimension}px`,
    height: `${dimension}px`,
    padding: size === "small" ? '8px 6px' : '16px 12px', // สเกล padding ตามขนาด
    flexDirection: 'column',
    alignItems: 'center', // ปรับเป็น center เพื่อให้ไอคอนอยู่กลางปุ่ม
    justifyContent: 'center',
    aspectRatio: '1/1',
    borderRadius: '50%', // ให้เป็นวงกลมเสมอ
    border: '0.2px solid #FFF',
    background: 'rgba(255, 255, 255, 0.80)',
    boxShadow: '1px 2px 4px 0 #FFF inset',
    cursor: 'pointer',
    transition: 'all 0.002s ease',
    outline: 'none',
    borderStyle: 'solid'
  };

  const svgStyle: React.CSSProperties = {
    filter: isActive ? 'drop-shadow(0 0 1.6px rgba(255, 130, 158, 0.83))' : 'none',
    transition: 'all 0.002s ease',
    flexShrink: 0
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={onClick}
      className="cat-paw-button"
    >
      <svg 
        width={svgWidth} 
        height={svgHeight} 
        viewBox="0 0 20 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
      >
        {/* ส่วนอุ้งเท้าล่าง */}
        <path 
          d="M7.74832 7.9476C8.95155 7.32663 10.979 7.28415 12.1527 7.9476L16.2369 10.1505C16.3901 10.2371 16.5354 10.334 16.6717 10.4403C19.3568 12.5357 17.2058 16.42 13.6823 15.8385L11.2255 15.2034C10.7664 15.1276 10.0612 15.1249 9.6028 15.2034L6.71889 15.9363C3.23301 16.5333 0.974785 12.7898 3.48275 10.5717C3.70126 10.3784 3.94708 10.2108 4.21413 10.073L7.74832 7.9476Z" 
          fill={iconColor} 
        />
        {/* นิ้วที่ 1 (ซ้ายไปขวา) */}
        <ellipse 
          cx="2.31453" cy="2.86928" rx="2.31453" ry="2.86928" 
          transform="matrix(0.99456 -0.104168 0.13332 0.991073 4.80002 0.586304)" 
          fill={iconColor} 
        />
        {/* นิ้วที่ 2 */}
        <ellipse 
          cx="2.06293" cy="2.63073" rx="2.06293" ry="2.63073" 
          transform="matrix(0.948129 -0.317887 0.395506 0.918463 0 4.53156)" 
          fill={iconColor} 
        />
        {/* นิ้วที่ 3 */}
        <ellipse 
          cx="2.06293" cy="2.63073" rx="2.06293" ry="2.63073" 
          transform="matrix(-0.948129 -0.317887 -0.395506 0.918463 20 4.53156)" 
          fill={iconColor} 
        />
        {/* นิ้วที่ 4 */}
        <ellipse 
          cx="2.30954" cy="2.87717" rx="2.30954" ry="2.87717" 
          transform="matrix(0.986845 0.161669 -0.205901 0.978573 10.9469 0)" 
          fill={iconColor} 
        />
      </svg>
    </button>
  );
}