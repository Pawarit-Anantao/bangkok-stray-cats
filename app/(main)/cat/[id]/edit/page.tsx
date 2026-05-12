"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

// Components (ใช้ชุดเดียวกับหน้า Add)
import MapHandle from "@/components/MapHandle";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import LocationDisplay from "@/components/LocationDisplay";
import PhotoUploader from "../../../add/components/CatPhotoUploader";
import AttributeSection from "@/components/attributes";

const MAP_HEIGHTS = ["60dvh", "25dvh", "2px"];
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังเตรียมแผนที่...</div>,
});

export default function EditCatPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [mapState, setMapState] = useState(0); 
  const [center, setCenter] = useState({ lat: 13.7649, lng: 100.5383 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [catName, setCatName] = useState("");
  const [catInfo, setCatInfo] = useState("");      
  const [healthInfo, setHealthInfo] = useState(""); 
  const [extraInfo, setExtraInfo] = useState("");   
  const [aggressiveness, setAggressiveness] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>({
    pattern: [], color: [], fur_length: [], size: [], gender: [], health: []
  });
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);

  // 1. ตรวจสอบสิทธิ์และดึงข้อมูลเดิม
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // ดึงข้อมูลแมว
        const { data: cat, error } = await supabase
          .from('cats')
          .select(`*, cat_photos(public_url)`)
          .eq('id', id)
          .single();

        if (error || !cat) throw new Error("ไม่พบข้อมูลแมว");

        // เช็คว่าเป็นเจ้าของหรือไม่ (หรือเป็น Admin)
        const { data: profile } = await supabase.from('users').select('role').eq('id', session?.user.id).single();
        if (cat.added_by !== session?.user.id && profile?.role !== 'admin') {
          alert("คุณไม่มีสิทธิ์แก้ไขข้อมูลน้องแมวตัวนี้ครับ");
          router.replace(`/cat/${id}`);
          return;
        }

        // Mapping ข้อมูลลง State
        setCatName(cat.name || "");
        setCatInfo(cat.identifying_marks || "");
        setHealthInfo(cat.last_health_note || "");
        setExtraInfo(cat.description || "");
        setCenter({ lat: cat.lat, lng: cat.lng });
        
        // แปลงความดุกลับเป็น Slug
        const aggSlug = cat.last_aggression_score === 1 ? 'very_friendly' : 
                        cat.last_aggression_score === 2 ? 'chill' :
                        cat.last_aggression_score === 3 ? 'normal' :
                        cat.last_aggression_score === 4 ? 'timid' : 'fierce';
        setAggressiveness(cat.last_aggression_score ? aggSlug : null);

        // แปลงลักษณะทางกายภาพลง Tags
        setSelectedTags({
          pattern: cat.pattern !== 'unknown' ? [cat.pattern] : [],
          color: cat.color !== 'unknown' ? [cat.color] : [],
          fur_length: cat.fur_length !== 'unknown' ? [cat.fur_length] : [],
          size: cat.size !== 'unknown' ? [cat.size] : [],
          gender: cat.gender !== 'unknown' ? [cat.gender] : [],
          health: cat.last_health_tags ? cat.last_health_tags.split(',') : []
        });

        // ดึงรูปภาพ
        setUploadedPhotoUrls(cat.cat_photos?.map((p: any) => p.public_url) || []);

      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, router]);

  // ดึง Master Tags
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from('cat_tags').select('*').eq('is_active', true);
      if (data) setAllTags(data);
    };
    fetchTags();
  }, []);

  const handleUpdate = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      
      const getFirstTag = (catKey: string) => selectedTags[catKey]?.[0] || 'unknown';
      const aggressionScore = aggressiveness ? 
        (aggressiveness === 'very_friendly' ? 1 : aggressiveness === 'chill' ? 2 : aggressiveness === 'normal' ? 3 : aggressiveness === 'timid' ? 4 : 5) : null;

      // 1. อัปเดตข้อมูลในตาราง cats
      const { error: catError } = await supabase.from('cats').update({
        name: catName,
        description: extraInfo,
        identifying_marks: catInfo,
        lat: center.lat, 
        lng: center.lng,
        pattern: getFirstTag('pattern'), 
        color: getFirstTag('color'),
        fur_length: getFirstTag('fur_length'), 
        size: getFirstTag('size'),
        gender: getFirstTag('gender'), 
        last_aggression_score: aggressionScore,
        last_health_note: healthInfo,
        last_health_tags: selectedTags['health']?.join(','),
        updated_at: new Date().toISOString()
      }).eq('id', id);

      if (catError) throw catError;

      // 2. จัดการรูปภาพ (ลบรูปเก่าในตารางแล้วเพิ่มใหม่ - แบบง่ายที่สุดเพื่อให้ตรงกับหน้า Add)
      await supabase.from('cat_photos').delete().eq('cat_id', id);
      if (uploadedPhotoUrls.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        const photoEntries = uploadedPhotoUrls.map((url, idx) => ({
          cat_id: id, 
          public_url: url, 
          storage_path: url.split('/').pop()?.split('?')[0],
          is_primary: idx === 0, 
          uploaded_by: user?.id
        }));
        await supabase.from('cat_photos').insert(photoEntries);
      }

      alert("แก้ไขข้อมูลเรียบร้อยแล้วครับ");
      router.push(`/cat/${id}`);
      router.refresh();

    } catch (err: any) { 
      alert(`เกิดข้อผิดพลาด: ${err.message}`); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (loading) return <div style={loadingStyle}>กำลังดึงข้อมูลน้องแมว...</div>;

  return (
    <main style={mainLayout}>
      <style jsx global>{`
        input, textarea { min-height: 38px !important; height: auto !important; padding: 8px 12px !important; border-radius: 10px !important; font-size: 13px !important; box-sizing: border-box !important; width: 100% !important; }
        textarea { min-height: 60px !important; }
      `}</style>

      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map isPickerMode={true} onCenterChange={setCenter} />
        {mapState !== 2 && (
          <div style={centerPinContainer}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#FF4D4D" stroke="white" strokeWidth="1"/>
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
            
            <PhotoUploader 
              photoUrls={uploadedPhotoUrls} 
              onUploadComplete={(urls) => setUploadedPhotoUrls(prev => [...prev, ...urls])} 
              onRemovePhoto={(index) => setUploadedPhotoUrls(prev => prev.filter((_, i) => i !== index))}
            />

            <FormField label="ชื่อน้องแมว (ถ้ามี)">
              <input type="text" placeholder="ระบุชื่อน้องแมว..." value={catName} onChange={(e) => setCatName(e.target.value)} style={slimInputStyle} />
            </FormField>

            <AttributeSection 
              allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
              aggressiveness={aggressiveness} setAggressiveness={setAggressiveness}
              catInfo={catInfo} setCatInfo={setCatInfo}
              healthInfo={healthInfo} setHealthInfo={setHealthInfo}
              extraInfo={extraInfo} setExtraInfo={setExtraInfo}
            />
          </div>
          
          <div style={buttonGroupContainer}>
            <Button variant="ghost" onClick={() => router.back()} style={{ flex: 1, height: '40px' }}>ยกเลิก</Button>
            <Button onClick={handleUpdate} disabled={isSubmitting} style={{ flex: 1, height: '40px' }}>
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Styles (Identical to Add Page) ---
const centerPinContainer: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 1001, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const slimInputStyle: React.CSSProperties = { background: '#FFF', border: '1.5px solid #D2CCBB', outline: 'none' };
const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', width: '100%', height: '100dvh', overflow: 'hidden', backgroundColor: '#F5F0E6' };
const mapWrapper: React.CSSProperties = { position: 'relative', width: '100%', transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10, flexShrink: 0 };
const contentWrapper: React.CSSProperties = { flex: 1, padding: '20px 20px 24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const innerFormContainer: React.CSSProperties = { width: '100%', maxWidth: '334px', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const formFieldsWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' };
const buttonGroupContainer: React.CSSProperties = { display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '15px', marginTop: '25px', width: '100%', paddingBottom: '30px' };
const backCircleBtn: React.CSSProperties = { position: 'absolute', top: '15px', left: '15px', zIndex: 1002, background: '#FFF', border: 'none', borderRadius: '50%', width: '36px', height: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const loadingStyle: React.CSSProperties = { width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', backgroundColor: '#F5F0E6' };