"use client";

import React from "react";

interface TagChipProps {
  label: string;
  category: string;
  onRemove?: () => void; // ทำให้เป็น optional เพื่อใช้ในหน้าแสดงผลที่ไม่มีปุ่มปิด
  size?: 'small' | 'large';
}

export default function TagChip({ label, category, onRemove, size = 'small' }: TagChipProps) {
  // 🎨 กำหนดสีตามหมวดหมู่ที่คุณระบุมา
  const categoryColors: { [key: string]: string } = {
    pattern: '#5990FF',    // ลาย
    color: '#F9AD44',      // สี
    fur_length: '#BB954A', // ขน
    size: '#73AC46',       // ขนาด
    health: '#94AE2C',     // สุขภาพ
    gender: '#C22D5C',     // เพศ
  };

  const themeColor = categoryColors[category] || '#D2CCBB';

  // 📏 กำหนดขนาดของ Tag
  const isLarge = size === 'large';
  const styles = {
    padding: isLarge ? '8px 16px' : '4px 10px',
    fontSize: isLarge ? '16px' : '13px',
    borderRadius: isLarge ? '24px' : '20px',
    iconSize: isLarge ? '18' : '14',
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: styles.padding,
      background: '#FFFAF0', // ✨ สีพื้นหลังนวลตามคำขอ
      borderRadius: styles.borderRadius,
      border: `1.5px solid ${themeColor}`, // ✨ สีเส้นขอบตามประเภท
      fontSize: styles.fontSize,
      fontFamily: 'var(--font-noto-looped)',
      color: '#333',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontWeight: isLarge ? '500' : 'normal' }}>{label}</span>
      
      {/* โชว์ปุ่มปิดเฉพาะเมื่อมีการส่งฟังก์ชัน onRemove มาให้ */}
      {onRemove && (
        <button 
          onClick={onRemove} 
          style={{ 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer', 
            padding: 0, 
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg 
            width={styles.iconSize} 
            height={styles.iconSize} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={themeColor} // ✨ สีไอคอนปิดเดียวกับเส้นขอบ
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  );
}