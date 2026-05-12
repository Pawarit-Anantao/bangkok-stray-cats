"use client";

import React, { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface CatPhotoUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  onRemovePhoto: (index: number) => void;
  photoUrls: string[];
}

const CatPhotoUploader: React.FC<CatPhotoUploaderProps> = ({
  onUploadComplete,
  onRemovePhoto,
  photoUrls,
}) => {
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const currentCount = photoUrls.length;

  const handleBoxClick = () => {
    if (isUploading) return;

    if (currentCount >= 3) {
      alert("อัปโหลดรูปภาพได้สูงสุด 3 รูปเท่านั้นครับ");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(
        `ไฟล์ใหญ่เกินไป! กรุณาเลือกรูปที่ไม่เกิน 3MB (รูปของคุณขนาด ${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      );
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("cat-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("cat-photos").getPublicUrl(filePath);

      onUploadComplete([publicUrl]);

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
          {isUploading ? "กำลังอัปโหลด..." : `${currentCount}/3`}
        </span>
      </div>

      {photoUrls.length > 0 && (
        <div style={previewGridStyle}>
          {photoUrls.map((url, index) => (
            <div key={index} style={imageWrapperStyle}>
              <img src={url} alt={`Cat preview ${index}`} style={imageStyle} />
              <button
                onClick={() => onRemovePhoto(index)}
                style={removeBtnStyle}
                type="button"
                title="ลบรูปภาพ"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div
        style={{
          ...uploaderBoxStyle,
          opacity: isUploading ? 0.6 : 1,
          cursor: isUploading ? "not-allowed" : "pointer",
          display: currentCount >= 3 ? "none" : "flex",
        }}
        onClick={handleBoxClick}
      >
        <div style={contentInsideStyle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8F8362"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span
            style={{
              fontFamily: FONT_VARIABLE,
              fontSize: "13px",
              marginTop: "4px",
              color: "#8F8362",
            }}
          >
            {isUploading ? "กำลังโหลด..." : "เพิ่มรูปภาพน้องแมว"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CatPhotoUploader;

const FONT_FAMILY = "var(--font-noto-looped), sans-serif";

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
  boxSizing: "border-box",
};

const labelWrapperStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "baseline",
};

const mainLabelTextStyle: React.CSSProperties = {
  color: "#000",
  fontFamily: FONT_FAMILY,
  fontSize: "16px",
  fontWeight: "normal",
};

const subHeaderTextStyle: React.CSSProperties = {
  color: "#8F8362",
  fontFamily: FONT_FAMILY,
  fontSize: "11px",
  textAlign: "right",
};

const previewGridStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "4px",
};

const imageWrapperStyle: React.CSSProperties = {
  position: "relative",
  width: "80px",
  height: "80px",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid #D2CCBB",
};

const removeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "-6px",
  right: "-6px",
  background: "#FF4D4D",
  color: "#FFF",
  border: "none",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  fontSize: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  padding: 0,
};

const uploaderBoxStyle: React.CSSProperties = {
  width: "100%",
  height: "80px",
  background: "#F7F7F7",
  borderRadius: "12px",
  border: "1.5px dashed #D2CCBB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  boxSizing: "border-box",
};

const contentInsideStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
