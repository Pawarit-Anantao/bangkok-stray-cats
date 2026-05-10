"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";

  return (
    <div style={containerStyle}>
      <div style={labelWrapperStyle}>
        <span style={{ 
          fontFamily: FONT_VARIABLE, 
          fontSize: '16px', 
          color: '#000', 
        }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex', 
  flexDirection: 'column', 
  gap: '8px',
  width: '100%', 
  maxWidth: '334px', 
  margin: '0 auto',
  boxSizing: 'border-box', // ✨ เพิ่มตัวนี้เข้าไปเพื่อความชัวร์ในการคำนวณพื้นที่
};

const labelWrapperStyle: React.CSSProperties = {
  display: 'flex', 
  width: '100%', 
  justifyContent: 'flex-start', 
  paddingLeft: '2px',
  boxSizing: 'border-box', // ✨ เพิ่มตัวนี้ด้วยครับ
};