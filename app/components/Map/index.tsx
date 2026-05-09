"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocateButton from "./components/LocateButton";

// 💡 1. เพิ่ม Interface เพื่อรับ Props จากหน้าอื่น (เช่น หน้า /add)
interface MapProps {
  isPickerMode?: boolean;
  onCenterChange?: (coords: { lat: number; lng: number }) => void;
}

// 💡 2. ตัวช่วยคอยจับพิกัดกลางจอเมื่อมีการเลื่อนแผนที่
function CenterTracker({ onCenterChange }: { onCenterChange: (c: { lat: number; lng: number }) => void }) {
  const map = useMapEvents({
    move() {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}

// หมุด Figma สำหรับตัวผู้ใช้ (User Location)
const figmaPinIcon = L.divIcon({
  className: "custom-pin",
  html: `
    <div style="filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); display: flex;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38" fill="none">
        <path d="M13.9023 0C21.5804 0 27.8046 6.22428 27.8047 13.9023C27.4998 21.4999 19 32.5 14 38C9 32.5 0.500008 21.4999 0 13.9023C5.15434e-05 6.22431 6.22431 5.154e-05 13.9023 0ZM14.2109 6.17871C10.1162 6.17895 6.79688 9.49891 6.79688 13.5938C6.79701 17.6885 10.1162 21.0076 14.2109 21.0078C18.3058 21.0078 21.6258 17.6886 21.626 13.5938C21.626 9.49876 18.3059 6.17871 14.2109 6.17871Z" fill="#5180CE"/>
      </svg>
    </div>
  `,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -35],
});

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 💡 3. เพิ่ม props เข้ามาใน Function Map
export default function Map({ isPickerMode = false, onCenterChange }: MapProps) {
  const startingPosition: [number, number] = [13.7649, 100.5383];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  return (
    <MapContainer center={startingPosition} zoom={14} zoomControl={false} className="w-full h-full z-0">      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* 💡 4. ถ้าอยู่ในโหมดเลือกตำแหน่ง ให้เปิดตัว CenterTracker */}
      {isPickerMode && onCenterChange && (
        <CenterTracker onCenterChange={onCenterChange} />
      )}

      {/* ปุ่มหาตำแหน่งผู้ใช้ (โชว์ตลอด หรือจะปิดตอน Picker Mode ก็ได้ครับ) */}
      <LocateButton onLocationFound={setUserPosition} />

      {/* วาดหมุดเมื่อเจอตำแหน่งผู้ใช้ */}
      {userPosition && (
        <Marker position={userPosition} icon={figmaPinIcon}>
          <Popup>
            <div className="text-center font-thai">คุณอยู่ตรงนี้</div>
          </Popup>
        </Marker>
      )}

      {/* หมุดน้องแมว (ตัวอย่างเดิม - จะโชว์เฉพาะตอน "ไม่" ได้ปักหมุดใหม่) */}
      {!isPickerMode && (
        <Marker position={startingPosition} icon={customIcon}>
          <Popup>
            <div className="text-center font-thai">
              <b className="text-base text-[#FF146E]">น้องแมวอยู่แถวนี้! 🐈</b>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}