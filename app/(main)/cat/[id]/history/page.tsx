"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Components
import TagChip from "@/components/TagChip";
import Pagination from "@/components/Pagination";

export default function SightingHistoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [catName, setCatName] = useState("");
  const [sightings, setSightings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchHeaderInfo() {
      const { data } = await supabase.from('cats').select('name').eq('id', id).single();
      if (data) setCatName(data.name || "น้องแมวไม่มีชื่อ");

      const { count } = await supabase
        .from('cat_sightings')
        .select('*', { count: 'exact', head: true })
        .eq('cat_id', id);
      setTotalCount(count || 0);
    }
    fetchHeaderInfo();
  }, [id]);

  useEffect(() => {
    async function fetchSightings() {
      try {
        setLoading(true);
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        // ✨ แก้ไขจุดนี้: เรียก username ผ่านตาราง public.users (Join อัตโนมัติหลังแก้ FK)
        const { data, error } = await supabase
          .from('cat_sightings')
          .select(`
            *,
            users ( username ), 
            sighting_health_tags ( tag_key )
          `)
          .eq('cat_id', id)
          .order('seen_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // ดึง Label ภาษาไทยมา Map
        const { data: tagLabels } = await supabase.from('cat_tags').select('key, label_th').eq('category', 'health');

        const formattedData = data.map((s: any) => ({
          ...s,
          // ดึงชื่อจากโครงสร้าง Join ใหม่
          username: s.users?.username || "ผู้ใช้ทั่วไป",
          health_tags: s.sighting_health_tags.map((st: any) => 
            tagLabels?.find(t => t.key === st.tag_key)
          ).filter(Boolean)
        }));

        setSightings(formattedData);
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSightings();
  }, [id, currentPage]);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateStr));
  };

  if (loading && currentPage === 1) return <div style={loadingStyle}>กำลังโหลดประวัติ...</div>;

  return (
    <main style={mainLayout}>
      <header style={headerStyle}>
        <button onClick={() => router.back()} style={backBtnStyle}>←</button>
        <h1 style={titleStyle}>ข้อมูลการพบเห็นของ {catName}</h1>
      </header>

      <section style={listContainerStyle}>
        {sightings.length > 0 ? sightings.map((s) => (
          <div key={s.id} style={sightingCardStyle}>
            <div style={headerRowStyle}>
              <div style={dateTextStyle}>{formatDate(s.seen_at)}</div>
              <div style={authorSubtextStyle}>เพิ่มโดย {s.username}</div>
            </div>

            <div style={tagRowStyle}>
              {s.health_tags.length > 0 ? s.health_tags.map((tag: any) => (
                <TagChip key={tag.key} label={tag.label_th} category="health" size="small" />
              )) : <span style={noDataStyle}>ไม่มีป้ายกำกับสุขภาพ</span>}
            </div>

            <div style={noteSectionStyle}>
              <p style={noteTextStyle}>{s.health_note || s.note || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
            </div>

            <div style={locationBoxStyle}>
              <span style={{ fontSize: '12px' }}> </span>
              <p style={locationTextStyle}>
                {s.address_name ? `${s.address_name}: ` : ""}{s.address_detail || "ไม่ระบุพิกัดที่ชัดเจน"}
              </p>
            </div>
          </div>
        )) : (
          <div style={noDataFullStyle}>ยังไม่มีประวัติการพบเห็นน้องแมวตัวนี้</div>
        )}
      </section>

      {totalCount > ITEMS_PER_PAGE && (
        <div style={paginationWrapperStyle}>
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      )}
    </main>
  );
}

// --- Styles (ล็อคระดับ 400 ทั้งหมดตามที่คุณสั่ง) ---
const FONT_VAR = 'var(--font-noto-looped)';
const mainLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#F5F0E6', padding: '20px', fontFamily: FONT_VAR };
const headerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' };
const titleStyle: React.CSSProperties = { fontSize: '20px', fontWeight: 400, margin: 0 };
const backBtnStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };
const listContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 };
const sightingCardStyle: React.CSSProperties = { background: '#FFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' };
const headerRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const dateTextStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 400, color: '#000' };
const authorSubtextStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 400, color: '#8F8362' };
const tagRowStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '6px' };
const noteSectionStyle: React.CSSProperties = { minHeight: '20px' };
const noteTextStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 400, color: '#444', margin: 0, lineHeight: '1.5' };
const locationBoxStyle: React.CSSProperties = { display: 'flex', gap: '6px', background: '#F7F7F7', padding: '10px', borderRadius: '12px', height: '42px', alignItems: 'flex-start', overflow: 'hidden' };
const locationTextStyle: React.CSSProperties = { fontSize: '11px', color: '#8F8362', margin: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const paginationWrapperStyle: React.CSSProperties = { padding: '30px 0', display: 'flex', justifyContent: 'center' };
const loadingStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', color: '#8F8362', fontFamily: FONT_VAR };
const noDataStyle: React.CSSProperties = { fontSize: '12px', color: '#AAA', fontWeight: 400 };
const noDataFullStyle: React.CSSProperties = { textAlign: 'center', padding: '50px', color: '#8F8362', fontSize: '14px', fontWeight: 400 };