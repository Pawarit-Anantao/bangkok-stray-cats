"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Components
import MapToggle from "./components/MapToggle";
import AddButton from "./components/Map/components/AddButton";
import MapHandle from "./components/MapHandle";
import SearchBar from "./components/SearchBar";

// 1. 💡 Constants (จุดเดียวสำหรับแก้ความสูง)
const MAP_HEIGHTS = ["60dvh", "20dvh", "2px"];

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังโหลดแผนที่... 🗺️</div>,
});

export default function Home() {
  const router = useRouter();
  
  // 2. 💡 State Management
  const [mapMode, setMapMode] = useState<"official" | "community">("community");
  const [mapState, setMapState] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");

  // 3. 💡 Logic Helpers
  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);
  const handleToggle = () => setMapState((prev) => (prev + 1) % 3);

  return (
    <main style={mainLayout}>
      
      {/* 🗺️ ส่วนที่ 1: แผนที่และปุ่มควบคุม */}
      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map />

        {/* แสดง Overlay เฉพาะตอนกางแผนที่เต็ม (State 0) */}
        {mapState === 0 && (
          <div style={overlayContainer}>
            <div style={togglePos}>
              <MapToggle mode={mapMode} onChange={setMapMode} />
            </div>
            <AddButton onClick={() => router.push("/add")} />
          </div>
        )}

        <MapHandle state={mapState} onClick={handleToggle} />
      </section>

      {/* 🏠 ส่วนที่ 2: พื้นที่เนื้อหาและช่องค้นหา */}
      <section style={contentWrapper}>
        
        {/* ช่องค้นหาดีไซน์ Figma (336px) */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="search-bar-top" 
        />

        {/* 🐈 พื้นที่เตรียมใส่ Cat Cards (ตอนนี้ให้เป็นช่องว่างสะอาดๆ) */}
        <div style={emptyContentStyle}>
          {!searchQuery && <p>น้องแมวรอบตัวคุณ</p>}
          {searchQuery && <p>ผลการค้นหาสำหรับ "{searchQuery}"</p>}
        </div>

      </section>

    </main>
  );
}

// --- 💡 4. Styles (แยกออกมาเพื่อความคลีน) ---

const mainLayout: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100dvh', // ใช้ dvh เพื่อให้เต็มจอทุกเบราว์เซอร์มือถือ
  overflow: 'hidden',
  backgroundColor: '#F5F0E6',
};

const mapWrapper: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 10,
  backgroundColor: '#E8E4D9',
  flexShrink: 0,
};

const overlayContainer: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none', // เพื่อให้ยังคลิกแผนที่ได้
  zIndex: 1000,
};

const togglePos: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  pointerEvents: 'auto', // คืนค่าเพื่อให้คลิก Toggle ได้
};

const contentWrapper: React.CSSProperties = {
  flex: 1,
  padding: '45px 20px 20px 20px', // เผื่อที่ให้ MapHandle
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // เพื่อให้ SearchBar (336px) อยู่กึ่งกลาง
};

const emptyContentStyle: React.CSSProperties = {
  marginTop: '30px',
  color: '#8F8362',
  fontSize: '14px',
  opacity: 0.6,
  fontFamily: 'inherit',
};

const loadingStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#999',
};