"use client";

import { useMap } from "react-leaflet";

// 💡 กำหนด Props ที่ต้องรับ
interface LocateButtonProps {
  onLocationFound: (location: [number, number]) => void;
}

export default function LocateButton({ onLocationFound }: LocateButtonProps) {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่งครับ");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords: [number, number] = [latitude, longitude];

        // 💡 ส่งพิกัดกลับไปที่หน้า Map
        onLocationFound(coords);

        map.flyTo(coords, 16, {
          animate: true,
          duration: 1.5,
        });
      },
      () => {
        alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้ โปรดเช็คการตั้งค่าสิทธิ์ครับ");
      },
      { enableHighAccuracy: true } // 💡 ช่วยให้ตำแหน่งแม่นยำขึ้น
    );
  };

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'inline-flex',
        height: '38px',
        width: '38px',
        padding: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '99px',
        background: '#FFF',
        boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.60)',
        cursor: 'pointer',
        border: 'none',
      }}
      onClick={handleLocate}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="7" stroke="#5180CE" stroke-width="2"/>
        <circle cx="12" cy="12" r="2" fill="#5180CE" stroke="#5180CE" stroke-width="2"/>
        <path d="M12 5V3" stroke="#5180CE" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 12L21 12" stroke="#5180CE" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 21L12 19" stroke="#5180CE" stroke-width="2" stroke-linecap="round"/>
        <path d="M3 12H5" stroke="#5180CE" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  );
}