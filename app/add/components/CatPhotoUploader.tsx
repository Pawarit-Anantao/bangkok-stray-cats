"use client";

import React, { useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";

// 1. ✨ กำหนด Interface ให้ชัดเจน (แนะนำให้ใส่ export ไว้ด้วยกันพลาด)
export interface CatPhotoUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  currentCount: number; 
}

// 2. ✨ ใช้ React.FC เพื่อกำจัดปัญหา IntrinsicAttributes ในบางกรณี
const CatPhotoUploader: React.FC<CatPhotoUploaderProps> = ({ 
  onUploadComplete, 
  currentCount 
}) => {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBoxClick = () => {
    if (isUploading) return;

    // 🛑 1. เช็กจำนวนรูป: ถ้าครบ 3 แล้ว ห้ามกดเพิ่ม
    if (currentCount >= 3) {
      alert("อัปโหลดรูปภาพได้สูงสุด 3 รูปเท่านั้นครับ");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 🛑 2. เช็กขนาดไฟล์: 3MB
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`ไฟล์ใหญ่เกินไป! กรุณาเลือกรูปที่ไม่เกิน 3MB (รูปของคุณขนาด ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      event.target.value = ""; 
      return;
    }

    try {
      setIsUploading(true);

      // --- 🚀 อัปโหลดไป Supabase ---
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cat-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cats')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cats')
        .getPublicUrl(filePath);

      // ✨ ส่งกลับไปหาแม่ (AddCatPage)
      onUploadComplete([publicUrl]);
      
      // ล้างค่าเพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้ามีการลบออก
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error: any) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดขณะอัปโหลด: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={labelWrapperStyle}>
        <span style={mainLabelTextStyle}>รูปภาพน้องแมว</span>
        <span style={subHeaderTextStyle}>
          {isUploading ? "กำลังอัปโหลด..." : `เลือกรูปที่เห็นชัดเจน (${currentCount}/3)`}
        </span>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div 
        style={{
          ...uploaderBoxStyle, 
          opacity: (isUploading || currentCount >= 3) ? 0.6 : 1,
          cursor: (isUploading || currentCount >= 3) ? 'not-allowed' : 'pointer',
          borderColor: currentCount >= 3 ? '#E8E4D9' : '#D2CCBB'
        }} 
        onClick={handleBoxClick}
      >
        <div style={contentInsideStyle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8F8362" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ fontFamily: FONT_VARIABLE, fontSize: '14px', marginTop: '6px', color: '#8F8362' }}>
            {currentCount >= 3 ? "ครบจำนวนรูปสูงสุดแล้ว" : "เพิ่มรูปภาพน้องแมว"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CatPhotoUploader;

// --- 🎨 Styles (คงเดิม) ---
const FONT_FAMILY = "var(--font-noto-looped), sans-serif";
const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '334px', margin: '0 auto', boxSizing: 'border-box' };
const labelWrapperStyle: React.CSSProperties = { display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' };
const mainLabelTextStyle: React.CSSProperties = { color: '#000', fontFamily: FONT_FAMILY, fontSize: '20px', fontWeight: 'normal' };
const subHeaderTextStyle: React.CSSProperties = { color: '#8F8362', fontFamily: FONT_FAMILY, fontSize: '11px', textAlign: 'right' };
const uploaderBoxStyle: React.CSSProperties = { width: '100%', minHeight: '120px', background: '#F7F7F7', borderRadius: '12px', border: '1.5px dashed #D2CCBB', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxSizing: 'border-box' };
const contentInsideStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center' };