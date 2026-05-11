"use client";

import { useState, useEffect } from "react";

interface LocationDisplayProps {
  lat: number;
  lng: number;
}

export default function LocationDisplay({ lat, lng }: LocationDisplayProps) {
  const [address, setAddress] = useState<string>("กำลังระบุตำแหน่ง...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=th`
        );
        const data = await response.json();
        const addr = data.address;

        const district = addr.city_district || addr.district || addr.town || addr.suburb || "";
        const province = addr.province || addr.state || addr.city || "";
        const secondary = [
          addr.road,
          addr.suburb !== district ? addr.suburb : null,
          addr.neighbourhood
        ].filter(Boolean).join(" ");

        const displayAddr = [district, province, secondary].filter(Boolean).join(", ");
        setAddress(displayAddr || "ไม่พบข้อมูลที่อยู่");
      } catch (error) {
        setAddress("ไม่สามารถดึงข้อมูลที่อยู่ได้");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAddress, 800);
    return () => clearTimeout(timer);
  }, [lat, lng]);

  return (
    <div style={containerStyle}>
      {/* 🏷️ Header Section */}
      <div style={labelWrapperStyle}>
        <span style={mainLabelTextStyle}>ปักหมุดตำแหน่ง</span>
        <span style={subHeaderTextStyle}>เลื่อนหมุดให้ตรงกับตำแหน่งที่พบน้องแมว</span>
      </div>

      {/* 📦 Address Box Section */}
      <div style={addressBoxStyle}>
        <div style={addressContentStyle}>
          <span style={{ 
            ...addressTextStyle, 
            opacity: loading ? 0.6 : 1 
          }}>
            {loading ? "กำลังอัปเดตตำแหน่ง..." : address}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- 🎨 Styles (แก้ไขเรื่องฟอนต์โดยเฉพาะ) ---

// สร้างตัวแปรกลางสำหรับ Font เพื่อให้แก้ง่าย
const FONT_FAMILY = "'Noto Sans Thai Looped', sans-serif";

const containerStyle: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  width: '100%',
  maxWidth: '334px',
  margin: '0 auto',
};

const labelWrapperStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  alignSelf: 'stretch',
};

const mainLabelTextStyle: React.CSSProperties = {
  color: '#000',
  fontFamily: FONT_FAMILY, // ✅ ใช้ชื่อเต็มที่ถูกต้อง
  fontSize: '20px',
  fontWeight: 400,
  lineHeight: 'normal',
};

const subHeaderTextStyle: React.CSSProperties = {
  color: '#8F8362',
  fontFamily: FONT_FAMILY, // ✅ ใช้ชื่อเต็มที่ถูกต้อง
  fontSize: '11px',
  fontWeight: 400,
  lineHeight: 'normal',
  textAlign: 'right',
  paddingLeft: '8px',
};

const addressBoxStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '77px',
  width: '100%',
  padding: '8px 16px 12px 16px', 
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '10px',
  alignSelf: 'stretch',
  borderRadius: '12px',
  border: '2px solid #D2CCBB',
  background: '#F7F7F7',
  boxSizing: 'border-box',
};

const addressContentStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
};

const addressTextStyle: React.CSSProperties = {
  width: '100%',
  color: '#000',
  fontFamily: FONT_FAMILY, // ✅ ใช้ชื่อเต็มที่ถูกต้อง
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '1.4',
  textAlign: 'left',
  wordBreak: 'break-word',
};