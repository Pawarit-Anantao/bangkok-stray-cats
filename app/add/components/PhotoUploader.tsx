"use client";

import React, { useRef, useState } from "react";

export default function PhotoUploader() {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <div style={containerStyle}>
      {/* 🏷️ Header Section: จัดวางแบบซ้าย-ขวา ในบรรทัดเดียวกัน */}
      <div style={labelWrapperStyle}>
        <span style={mainLabelTextStyle}>รูปภาพน้องแมว</span>
        <span style={subHeaderTextStyle}>กรุณาเลือกรูปที่เห็นน้องแมวชัดเจน</span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={uploaderBoxStyle} onClick={handleBoxClick}>
        {previewUrl ? (
          <div style={previewContainer}>
             <img src={previewUrl} alt="Preview" style={imagePreviewStyle} />
             <div style={changePhotoOverlay}>แตะเพื่อเปลี่ยนรูป</div>
          </div>
        ) : (
          <div style={contentInsideStyle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8F8362" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontFamily: FONT_VARIABLE, fontSize: '14px', marginTop: '6px', color: '#8F8362' }}>
              เพิ่มรูปภาพน้องแมว
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 🎨 Styles ---
const FONT_FAMILY = "var(--font-noto-looped), sans-serif";

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px', // ปรับ Gap ให้กระชับขึ้นเหมือน LocationDisplay
  width: '100%',
  maxWidth: '334px',
  margin: '0 auto',
  boxSizing: 'border-box',
};

const labelWrapperStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',      // ✨ วางแนวนอน
  justifyContent: 'space-between', // ✨ ดันซ้าย-ขวา
  alignItems: 'baseline',    // ✨ ฐานตัวอักษรตรงกัน
  alignSelf: 'stretch',
};

const mainLabelTextStyle: React.CSSProperties = {
  color: '#000',
  fontFamily: FONT_FAMILY,
  fontSize: '20px', // ขนาด 16px ตามที่คุณต้องการสำหรับ FormField
  fontWeight: 'normal',
};

const subHeaderTextStyle: React.CSSProperties = {
  color: '#8F8362',
  fontFamily: FONT_FAMILY,
  fontSize: '11px', // ขนาดจิ๋วเหมือนของ LocationDisplay
  fontWeight: 400,
  lineHeight: 'normal',
  textAlign: 'right',
  paddingLeft: '8px',
};

const uploaderBoxStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '120px',
  background: '#F7F7F7',
  borderRadius: '12px',
  border: '2px dashed #D2CCBB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  boxSizing: 'border-box',
};

const contentInsideStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const previewContainer: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

const imagePreviewStyle: React.CSSProperties = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  display: 'block'
};

const changePhotoOverlay: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0,0,0,0.4)',
  color: '#fff',
  fontSize: '12px',
  textAlign: 'center',
  padding: '4px 0',
  fontFamily: FONT_FAMILY
};