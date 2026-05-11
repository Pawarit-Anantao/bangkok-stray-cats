"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { renderToString } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "@/lib/supabase";

import LocateButton from "./components/LocateButton";
import CatMapMarker from "./components/CatMapMarker";

interface MapProps {
  isPickerMode?: boolean;
  showMarkers?: boolean;
  mode?: "official" | "community";
  onCenterChange?: (coords: { lat: number; lng: number }) => void;
}

// ✨ ส่วนประกอบจับเหตุการณ์ Zoom แบบ Real-time
function MapEventHandler({ 
  onZoomChange, 
  onCenterChange, 
  isPickerMode 
}: { 
  onZoomChange: (z: number) => void;
  onCenterChange?: (c: { lat: number; lng: number }) => void;
  isPickerMode: boolean;
}) {
  const map = useMapEvents({
    zoom() { // ✨ ใช้ 'zoom' แทน 'zoomend' เพื่อความสมูทขณะซูม
      onZoomChange(map.getZoom());
    },
    move() {
      if (isPickerMode && onCenterChange) {
        const center = map.getCenter();
        onCenterChange({ lat: center.lat, lng: center.lng });
      }
    },
  });
  return null;
}

// --- 📍 หมุด User ---
const figmaPinIcon = L.divIcon({
  className: "custom-user-pin",
  html: renderToString(
    <div style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))", display: "flex" }}>
      <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.9023 0C21.5804 0 27.8046 6.22428 27.8047 13.9023C27.4998 21.4999 19 32.5 14 38C9 32.5 0.500008 21.4999 0 13.9023C5.15434e-05 6.22431 6.22431 5.154e-05 13.9023 0ZM14.2109 6.17871C10.1162 6.17895 6.79688 9.49891 6.79688 13.5938C6.79701 17.6885 10.1162 21.0076 14.2109 21.0078C18.3058 21.0078 21.6258 17.6886 21.626 13.5938C21.626 9.49876 18.3059 6.17871 14.2109 6.17871Z" fill="#5180CE"/>
      </svg>
    </div>
  ),
  iconSize: [28, 38],
  iconAnchor: [14, 38],
});

export default function Map({ 
  isPickerMode = false, 
  showMarkers = false, 
  mode = "community",
  onCenterChange 
}: MapProps) {
  const startingPosition: [number, number] = [13.7649, 100.5383];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [allCats, setAllCats] = useState<any[]>([]);
  
  // ✨ ตั้งค่า Zoom เริ่มต้นให้ตรงกับ MapContainer (15)
  const [zoomLevel, setZoomLevel] = useState(15);

  // ✨ คำนวณ Scale ของหมุด (1.0 - 1.7)
  const markerScale = useMemo(() => {
    // สูตร: เริ่มขยายที่ซูม 14, เพิ่มขั้นละ 0.175 จนถึง 1.7 ที่ซูม 18
    const scale = 1 + (Math.max(0, zoomLevel - 14) * 0.175);
    return Math.min(1.7, scale);
  }, [zoomLevel]);

  // ✨ ฟังก์ชันสร้าง Icon ที่ปรับขนาดตาม Scale จริง
  const createDynamicCatIcon = (url: string, mapType: "community" | "official") => {
    const baseWidth = 47;
    const baseHeight = 49;
    
    return L.divIcon({
      className: "cat-marker-icon",
      // ✨ สำคัญ: ส่ง markerScale เข้าไปใน Component
      html: renderToString(<CatMapMarker photoUrl={url} mode={mapType} scale={markerScale} />),
      // ✨ ปรับขนาดกรอบ Leaflet ให้ใหญ่ตาม scale ป้องกันการโดนตัดขอบ
      iconSize: [baseWidth * markerScale, baseHeight * markerScale],
      // ✨ ปรับจุดปักหมุดให้ลงที่ปลายแหลมเสมอ (อิงจาก SVG: x=23.5, y=37)
      iconAnchor: [23.5 * markerScale, 37 * markerScale],
      popupAnchor: [0, -35 * markerScale],
    });
  };

  useEffect(() => {
    if (showMarkers) {
      const fetchCats = async () => {
        const { data } = await supabase.from('cats').select(`id, name, lat, lng, map_type, cat_photos(public_url, is_primary)`);
        if (data) setAllCats(data);
      };
      fetchCats();
    }
  }, [showMarkers]);

  const displayCats = useMemo(() => {
    if (mode === "official") return allCats.filter(cat => cat.map_type === "official");
    return allCats;
  }, [allCats, mode]);

  return (
    <MapContainer center={startingPosition} zoom={15} zoomControl={false} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapEventHandler 
        onZoomChange={setZoomLevel} 
        onCenterChange={onCenterChange} 
        isPickerMode={isPickerMode} 
      />

      <LocateButton onLocationFound={setUserPosition} />

      {userPosition && (
        <Marker position={userPosition} icon={figmaPinIcon}>
          <Popup>คุณอยู่ตรงนี้</Popup>
        </Marker>
      )}

      {showMarkers && displayCats.map((cat) => {
        const primaryPhoto = cat.cat_photos?.find((p: any) => p.is_primary)?.public_url || cat.cat_photos?.[0]?.public_url;
        return (
          <Marker 
            key={cat.id} 
            position={[cat.lat, cat.lng]} 
            // ✨ ส่งค่าไปสร้าง Icon
            icon={createDynamicCatIcon(primaryPhoto, cat.map_type)}
          >
            <Popup>
              <div className="text-center font-thai">
                <b style={{ color: cat.map_type === 'official' ? '#5180CE' : '#FF146E' }}>
                  {cat.name || "น้องแมวไม่มีชื่อ"}
                </b>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}