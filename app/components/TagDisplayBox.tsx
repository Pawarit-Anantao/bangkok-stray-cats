"use client";

import React from "react"; // ✨ เพิ่มบรรทัดนี้ครับ

export default function TagDisplayBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '40px',
      // Padding เลียนแบบ LocationDisplay
      padding: '4px 16px 12px 16px', 
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      background: 'transparent',
      boxSizing: 'border-box',
    }}>
      {children}
      {/* ถ้ายังไม่มีการเลือก ให้โชว์ข้อความจางๆ */}
      {React.Children.count(children) === 0 && (
        <span style={{ fontSize: '13px', color: '#BDBDBD', fontFamily: 'var(--font-noto-looped)' }}>
          ยังไม่มีการเลือกลักษณะ...
        </span>
      )}
    </div>
  );
}