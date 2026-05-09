"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Components
import MapHandle from "../components/MapHandle";
import Button from "../components/Button";
import FormField from "./components/FormField";
import LocationDisplay from "./components/LocationDisplay";
import PhotoUploader from "./components/PhotoUploader";

const MAP_HEIGHTS = ["60dvh", "25dvh", "2px"];

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังเตรียมแผนที่... 🗺️</div>,
});

export default function AddCatPage() {
  const router = useRouter();
  const [mapState, setMapState] = useState(0); 
  const [center, setCenter] = useState({ lat: 13.7649, lng: 100.5383 });
  const [catName, setCatName] = useState("");
  const [catInfo, setCatInfo] = useState("");

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);

  return (
    <main style={mainLayout}>
      {/* 🗺️ ส่วนแผนที่ */}
      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map isPickerMode={true} onCenterChange={setCenter} />
        {mapState !== 2 && (
          <div style={fixedPinStyle}>
            <svg width="28" height="38" viewBox="0 0 28 38" fill="none">
              <path d="M13.9023 0C21.5804 0 27.8046 6.22428 27.8047 13.9023C27.4998 21.4999 19 32.5 14 38C9 32.5 0.500008 21.4999 0 13.9023C5.15434e-05 6.22431 6.22431 5.154e-05 13.9023 0ZM14.2109 6.17871C10.1162 6.17895 6.79688 9.49891 6.79688 13.5938C6.79701 17.6885 10.1162 21.0076 14.2109 21.0078C18.3058 21.0078 21.6258 17.6886 21.626 13.5938C21.626 9.49876 18.3059 6.17871 14.2109 6.17871Z" fill="#5180CE"/>
            </svg>
          </div>
        )}
        <button onClick={() => router.back()} style={backCircleBtn}>✕</button>
        <MapHandle state={mapState} onClick={() => setMapState((prev) => (prev + 1) % 3)} />
      </section>

      {/* 🏠 ส่วนฟอร์ม (จัดกึ่งกลางและคลีน) */}
      <section style={contentWrapper}>
        <div style={innerFormContainer}>
          <div style={{ width: '100%', marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={titleStyle}>ปักหมุดตำแหน่ง</h2>
            <p style={subtitleStyle}>เลื่อนแผนที่ให้หมุดตรงกับจุดที่พบน้องแมว</p>
          </div>

          <div style={formFieldsWrapper}>
            <LocationDisplay lat={center.lat} lng={center.lng} />
            
            <PhotoUploader />

            <FormField label="ชื่อน้องแมว (ถ้ามี)">
              <input 
                style={inputStyle} placeholder="ระบุชื่อน้องแมว..." 
                value={catName} onChange={(e) => setCatName(e.target.value)}
              />
            </FormField>

            <FormField label="รายละเอียด / ลักษณะเด่น">
              <textarea 
                style={{ ...inputStyle, height: '100px', paddingTop: '12px', resize: 'none' }} 
                placeholder="เช่น สีขน ปลอกคอ หรืออาการน้องแมว..."
                value={catInfo} onChange={(e) => setCatInfo(e.target.value)}
              />
            </FormField>
          </div>

          <div style={buttonGroupContainer}>
            <Button variant="ghost" onClick={() => router.back()} style={{ flex: 1, minWidth: '0' }}>ยกเลิก</Button>
            <Button onClick={() => alert("บันทึกข้อมูลเรียบร้อย!")} style={{ flex: 1, minWidth: '0' }}>ยืนยัน</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- 💡 Styles Object (เหมือนเดิม เพิ่มเติมคือความกึ่งกลาง) ---
const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', overflow: 'hidden', backgroundColor: '#F5F0E6' };
const mapWrapper: React.CSSProperties = { position: 'relative', width: '100%', transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, backgroundColor: '#E8E4D9', flexShrink: 0, overflow: 'visible' };
const contentWrapper: React.CSSProperties = { flex: 1, padding: '40px 20px 24px 20px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const innerFormContainer: React.CSSProperties = { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const formFieldsWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box' };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '20px', color: '#333', fontWeight: 'bold' };
const subtitleStyle: React.CSSProperties = { margin: '4px 0', fontSize: '14px', color: '#666' };
const inputStyle: React.CSSProperties = { width: '100%', height: '48px', background: '#FFF', borderRadius: '12px', border: '1px solid #D2CCBB', padding: '0 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const buttonGroupContainer: React.CSSProperties = { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '32px', width: '100%', boxSizing: 'border-box' };
const fixedPinStyle: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 1001, pointerEvents: 'none', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' };
const backCircleBtn: React.CSSProperties = { position: 'absolute', top: '20px', left: '20px', zIndex: 1002, background: '#FFF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const loadingStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' };