"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";

// Components
import MapHandle from "../components/MapHandle";
import Button from "../components/Button";
import FormField from "./components/FormField";
import LocationDisplay from "./components/LocationDisplay";
import PhotoUploader from "./components/PhotoUploader";
import AttributeSection from "./components/attributes";

const MAP_HEIGHTS = ["60dvh", "25dvh", "2px"];

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังเตรียมแผนที่... 🗺️</div>,
});

export default function AddCatPage() {
  const router = useRouter();
  
  // --- 📝 States สำหรับ UI แผนที่ ---
  const [mapState, setMapState] = useState(0); 
  const [center, setCenter] = useState({ lat: 13.7649, lng: 100.5383 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 📝 States สำหรับข้อมูลแมว (ยกมาไว้ที่นี่เพื่อให้ handleSubmit เห็น) ---
  const [catName, setCatName] = useState("");
  const [catInfo, setCatInfo] = useState("");      // รายละเอียดลักษณะเพิ่มเติม
  const [healthInfo, setHealthInfo] = useState(""); // รายละเอียดด้านสุขภาพ
  const [extraInfo, setExtraInfo] = useState("");   // คำอธิบายเพิ่มเติม (หัวข้อใหญ่)
  const [aggressiveness, setAggressiveness] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>({
    pattern: [], color: [], fur_length: [], size: [], gender: [], health: []
  });
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]); // สำหรับรูปภาพ

  // --- 📝 ดึงข้อมูล Tags จาก DB ---
  const [allTags, setAllTags] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from('cat_tags')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setAllTags(data);
      if (error) console.error("Error fetching tags:", error);
    };
    fetchTags();
  }, []);

  // --- 🚀 ฟังก์ชันบันทึกข้อมูล (handleSubmit) ---
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // 0. ตรวจสอบ User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");
        return;
      }

      // Helper ดึงค่าแรกของแต่ละหมวด (เพราะ DB ตาราง cats เก็บ 1 คอลัมน์ต่อ 1 ค่า)
      const getFirstTag = (catKey: string) => selectedTags[catKey]?.[0] || 'unknown';

      // 1. INSERT ลงตาราง public.cats
      const { data: newCat, error: catError } = await supabase
        .from('cats')
        .insert({
          name: catName || "น้องแมวไม่มีชื่อ",
          description: extraInfo,           // คำอธิบายเพิ่มเติม
          identifying_marks: catInfo,       // รายละเอียดลักษณะ
          lat: center.lat,
          lng: center.lng,
          pattern: getFirstTag('pattern'),
          color: getFirstTag('color'),
          fur_length: getFirstTag('fur_length'),
          size: getFirstTag('size'),
          gender: getFirstTag('gender'),
          added_by: user.id,
          last_aggression_score: aggressiveness ? parseInt(aggressiveness === 'very_friendly' ? '1' : aggressiveness === 'fierce' ? '5' : '3') : null,
          last_health_note: healthInfo
        })
        .select()
        .single();

      if (catError) throw catError;

      // 2. INSERT ลงตาราง public.cat_sightings (บันทึกประวัติครั้งแรก)
      const { data: newSighting, error: sightingError } = await supabase
        .from('cat_sightings')
        .insert({
          cat_id: newCat.id,
          user_id: user.id,
          lat: center.lat,
          lng: center.lng,
          note: extraInfo,
          aggression_score: newCat.last_aggression_score,
          health_note: healthInfo,
          identifying_note: catInfo,
        })
        .select()
        .single();

      if (sightingError) throw sightingError;

      // 3. INSERT Health Tags (ถ้ามี)
      const healthTags = selectedTags['health'] || [];
      if (healthTags.length > 0) {
        const healthEntries = healthTags.map(tagKey => ({
          sighting_id: newSighting.id,
          tag_key: tagKey
        }));
        const { error: hError } = await supabase.from('sighting_health_tags').insert(healthEntries);
        if (hError) throw hError;
      }

      // 4. INSERT รูปภาพ (ถ้ามี)
      if (uploadedPhotoUrls.length > 0) {
        const photoEntries = uploadedPhotoUrls.map((url, idx) => ({
          cat_id: newCat.id,
          public_url: url,
          storage_path: `cats/${newCat.id}/${idx}`,
          is_primary: idx === 0,
          uploaded_by: user.id
        }));
        await supabase.from('cat_photos').insert(photoEntries);
      }

      alert("บันทึกข้อมูลน้องแมวเรียบร้อยแล้ว! 🐾");
      router.push(`/cat/${newCat.id}`); // ย้ายไปหน้าโปรไฟล์แมว

    } catch (err: any) {
      console.error(err);
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);

  return (
    <main style={mainLayout}>
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

      <section style={contentWrapper}>
        <div style={innerFormContainer}>
          <div style={formFieldsWrapper}>
            <LocationDisplay lat={center.lat} lng={center.lng} />
            
            {/* ส่ง callback เพื่อรับ URL รูปภาพหลังจากอัปโหลดสำเร็จ */}
            <PhotoUploader onUploadComplete={(urls: string[]) => setUploadedPhotoUrls(urls)} />

            <FormField label="ชื่อน้องแมว (ถ้ามี)">
              <input 
                style={inputStyle} placeholder="ระบุชื่อน้องแมว..." 
                value={catName} onChange={(e) => setCatName(e.target.value)}
              />
            </FormField>

            {/* ✨ ส่ง States ทั้งหมดลงไปให้ AttributeSection */}
            <AttributeSection 
              allTags={allTags} 
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              catInfo={catInfo}
              setCatInfo={setCatInfo}
              healthInfo={healthInfo}
              setHealthInfo={setHealthInfo}
              extraInfo={extraInfo}
              setExtraInfo={setExtraInfo}
            />
          </div>

          <div style={buttonGroupContainer}>
            <Button variant="ghost" onClick={() => router.back()} style={{ flex: 1, minWidth: '0' }}>
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              style={{ flex: 1, minWidth: '0' }}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- 💡 Styles Object (คงเดิมตามที่คุณส่งมา) ---
const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', overflow: 'hidden', backgroundColor: '#F5F0E6' };
const mapWrapper: React.CSSProperties = { position: 'relative', width: '100%', transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, backgroundColor: '#E8E4D9', flexShrink: 0, overflow: 'visible' };
const contentWrapper: React.CSSProperties = { flex: 1, padding: '40px 20px 24px 20px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const innerFormContainer: React.CSSProperties = { width: '100%', maxWidth: '334px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const formFieldsWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box' };
const inputStyle: React.CSSProperties = { width: '100%', height: '48px', background: '#FFF', borderRadius: '12px', border: '1.5px solid #D2CCBB', padding: '0 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const buttonGroupContainer: React.CSSProperties = { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '32px', width: '100%', boxSizing: 'border-box' };
const fixedPinStyle: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 1001, pointerEvents: 'none', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' };
const backCircleBtn: React.CSSProperties = { position: 'absolute', top: '20px', left: '20px', zIndex: 1002, background: '#FFF', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const loadingStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' };