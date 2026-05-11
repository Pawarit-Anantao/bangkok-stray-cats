"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

import MapToggle from "../components/MapToggle";
import AddButton from "../components/Map/components/AddButton";
import MapHandle from "../components/MapHandle";
import SearchBar from "../components/SearchBar";

const MAP_HEIGHTS = ["60dvh", "20dvh", "2px"];
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังโหลดแผนที่... 🗺️</div>,
});

export default function Home() {
  const router = useRouter();
  const [mapMode, setMapMode] = useState<"official" | "community">("community");
  const [mapState, setMapState] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isGuestUser, setIsGuestUser] = useState(false); // ✨ เพิ่ม state เช็ก Guest

  useEffect(() => {
    const checkAccess = async () => {
      // เช็กจาก Session ของ Supabase
      const { data: { session } } = await supabase.auth.getSession();
      // เช็กจาก LocalStorage (เผื่อเป็นโหมด Guest)
      const isGuest = localStorage.getItem("guest_mode");

      setIsGuestUser(!!isGuest);

      // 🛑 ถ้าไม่มีทั้งคู่ ให้ดีดไปหน้า Login
      if (!session && !isGuest) {
        router.push("/login");
      }
    };
    checkAccess();
  }, [router]);

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);
  const handleToggle = () => setMapState((prev) => (prev + 1) % 3);

  return (
    <main style={mainLayout}>
      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map />
        {mapState === 0 && (
          <div style={overlayContainer}>
            <div style={togglePos}>
              <MapToggle mode={mapMode} onChange={setMapMode} />
            </div>
            {/* ✨ แสดงปุ่ม + เฉพาะ User ที่ Login เท่านั้น (Guest จะไม่เห็น) */}
            {!isGuestUser && <AddButton onClick={() => router.push("/add")} />}
          </div>
        )}
        <MapHandle state={mapState} onClick={handleToggle} />
      </section>

      <section style={contentWrapper}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} className="search-bar-top" />
        <div style={emptyContentStyle}>
          {!searchQuery ? <p>น้องแมวรอบตัวคุณ</p> : <p>ผลการค้นหาสำหรับ "{searchQuery}"</p>}
        </div>
      </section>
    </main>
  );
}

// ... Styles (เหมือนเดิม)
const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', overflow: 'hidden', backgroundColor: '#F5F0E6' };
const mapWrapper: React.CSSProperties = { position: 'relative', width: '100%', transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, backgroundColor: '#E8E4D9', flexShrink: 0 };
const overlayContainer: React.CSSProperties = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1000 };
const togglePos: React.CSSProperties = { position: 'absolute', top: '16px', left: '16px', pointerEvents: 'auto' };
const contentWrapper: React.CSSProperties = { flex: 1, padding: '45px 20px 20px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const emptyContentStyle: React.CSSProperties = { marginTop: '30px', color: '#8F8362', fontSize: '14px', opacity: 0.6 };
const loadingStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' };