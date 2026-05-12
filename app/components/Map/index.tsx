"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { renderToString } from "react-dom/server";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"; // ✨ นำเข้าไลบรารี Cluster
import { supabase } from "@/lib/supabase";

import LocateButton from "./components/LocateButton";
import CatMapMarker from "./components/CatMapMarker";

interface MapProps {
  isPickerMode?: boolean;
  showMarkers?: boolean;
  mode?: "official" | "community";
  onCenterChange?: (coords: { lat: number; lng: number }) => void;
}

// ✨ ส่วนประกอบจับเหตุการณ์ Zoom และ Move
function MapEventHandler({
  onZoomChange,
  onCenterChange,
  isPickerMode,
}: {
  onZoomChange: (z: number) => void;
  onCenterChange?: (c: { lat: number; lng: number }) => void;
  isPickerMode: boolean;
}) {
  const map = useMapEvents({
    zoom() {
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
    <div
      style={{
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        display: "flex",
      }}
    >
      <svg
        width="28"
        height="38"
        viewBox="0 0 28 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9023 0C21.5804 0 27.8046 6.22428 27.8047 13.9023C27.4998 21.4999 19 32.5 14 38C9 32.5 0.500008 21.4999 0 13.9023C5.15434e-05 6.22431 6.22431 5.154e-05 13.9023 0ZM14.2109 6.17871C10.1162 6.17895 6.79688 9.49891 6.79688 13.5938C6.79701 17.6885 10.1162 21.0076 14.2109 21.0078C18.3058 21.0078 21.6258 17.6886 21.626 13.5938C21.626 9.49876 18.3059 6.17871 14.2109 6.17871Z"
          fill="#5180CE"
        />
      </svg>
    </div>,
  ),
  iconSize: [28, 38],
  iconAnchor: [14, 38],
});

export default function Map({
  isPickerMode = false,
  showMarkers = false,
  mode = "community",
  onCenterChange,
}: MapProps) {
  const router = useRouter();
  const startingPosition: [number, number] = [13.7649, 100.5383];
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );
  const [allCats, setAllCats] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(15);

  const markerScale = useMemo(() => {
    const scale = 1 + Math.max(0, zoomLevel - 14) * 0.175;
    return Math.min(1.7, scale);
  }, [zoomLevel]);

  const createDynamicCatIcon = (
    url: string,
    mapType: "community" | "official",
  ) => {
    const baseWidth = 47;
    const baseHeight = 49;

    return L.divIcon({
      className: "cat-marker-icon",
      html: renderToString(
        <CatMapMarker photoUrl={url} mode={mapType} scale={markerScale} />,
      ),
      iconSize: [baseWidth * markerScale, baseHeight * markerScale],
      iconAnchor: [23.5 * markerScale, 37 * markerScale],
      popupAnchor: [0, -35 * markerScale],
    });
  };

  useEffect(() => {
    if (showMarkers) {
      const fetchCats = async () => {
        // ✨ เพิ่ม .is('deleted_at', null) เพื่อกรองแมวที่ถูกลบออกแบบ Soft Delete
        const { data } = await supabase
          .from("cats")
          .select(
            `id, name, lat, lng, map_type, deleted_at, cat_photos(public_url, is_primary)`,
          )
          .is("deleted_at", null);

        if (data) setAllCats(data);
      };
      fetchCats();
    }
  }, [showMarkers]);

  const displayCats = useMemo(() => {
    if (mode === "official")
      return allCats.filter((cat) => cat.map_type === "official");
    return allCats;
  }, [allCats, mode]);

  return (
    <MapContainer
      center={startingPosition}
      zoom={15}
      zoomControl={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution="&copy; CARTO"
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

      {/* ✨ ห่อหุ้มหมุดแมวด้วย MarkerClusterGroup */}
      {showMarkers && (
        <MarkerClusterGroup
          chunkedLoading // เพิ่มประสิทธิภาพเมื่อหมุดเยอะ
          maxClusterRadius={50} // ระยะการรวมกลุ่ม (50px)
          disableClusteringAtZoom={18} // เมื่อซูมใกล้มาก (Lv.18) จะไม่รวมกลุ่มเพื่อให้เห็นแยกตัวชัดเจน
        >
          {displayCats.map((cat) => {
            const primaryPhoto =
              cat.cat_photos?.find((p: any) => p.is_primary)?.public_url ||
              cat.cat_photos?.[0]?.public_url;
            return (
              <Marker
                key={cat.id}
                position={[cat.lat, cat.lng]}
                icon={createDynamicCatIcon(primaryPhoto, cat.map_type)}
              >
                <Popup>
                  <div style={popupContainerStyle}>
                    <b
                      style={{
                        ...popupNameStyle,
                        color:
                          cat.map_type === "official" ? "#5180CE" : "#FF146E",
                      }}
                    >
                      {cat.name || "น้องแมวไม่มีชื่อ"}
                    </b>
                    <button
                      onClick={() => router.push(`/cat/${cat.id}`)}
                      style={popupButtonStyle}
                    >
                      ดูโปรไฟล์
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
}

// --- 🎨 Styles (เดิมของคุณ) ---
const popupContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  fontFamily: "var(--font-noto-looped)",
};

const popupNameStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "normal",
  textAlign: "center",
  marginBottom: "2px",
};

const popupButtonStyle: React.CSSProperties = {
  backgroundColor: "#FFFAF1",
  color: "#CDBC8E",
  border: "1px solid #CDBC8E",
  padding: "4px 12px",
  fontSize: "12px",
  borderRadius: "20px",
  cursor: "pointer",
  fontFamily: "var(--font-noto-looped)",
  outline: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.2s",
};
