"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import CatCard from "@/components/CatCard";
import SearchBar from "@/components/SearchBar";

export default function MyCatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myCats, setMyCats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        const hasSeenPolicy = localStorage.getItem("has_seen_mycats_policy");
        if (!hasSeenPolicy) {
          setIsInfoModalOpen(true);
          localStorage.setItem("has_seen_mycats_policy", "true");
        }

        const { data, error } = await supabase
          .from("cats")
          .select("*")
          .eq("added_by", session.user.id)
          .is("deleted_at", null)
          .order("last_seen_at", { ascending: false });

        if (error) throw error;
        setMyCats(data || []);
      } catch (err) {
        console.error("Error fetching cats:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const filteredMyCats = useMemo(() => {
    return myCats.filter((cat) => {
      const query = searchQuery.toLowerCase();
      return (
        cat.name?.toLowerCase().includes(query) ||
        cat.address_name?.toLowerCase().includes(query)
      );
    });
  }, [myCats, searchQuery]);

  const categorizedCats = useMemo(() => {
    const active: any[] = [];
    const pending: any[] = [];
    const today = new Date();

    filteredMyCats.forEach((cat) => {
      const isCommunity = cat.map_type === "community";
      const lastSeen = new Date(cat.last_seen_at);
      const diffDays = Math.floor(
        Math.abs(today.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (isCommunity && diffDays >= 30) {
        const daysRemaining = 60 - diffDays;
        pending.push({
          ...cat,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        });
      } else {
        active.push(cat);
      }
    });

    return { active, pending };
  }, [filteredMyCats]);

  if (loading)
    return <div style={loadingStyle}>กำลังเรียกข้อมูลน้องแมวของคุณ...</div>;

  return (
    <main style={mainLayout}>
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => router.back()} style={backBtnStyle}>
            ←
          </button>
          <h1 style={titleStyle}>แมวของคุณ</h1>
          <button onClick={() => setIsInfoModalOpen(true)} style={infoIconBtn}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
      </header>

      <div style={searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ค้นหาชื่อหรือเขต..."
          selectedTags={[]}
          onRemoveTag={() => {}}
          onOpenFilter={() => {}}
        />
      </div>

      <section style={contentWrapper}>
        <div style={sectionContainer}>
          <h2 style={sectionHeaderStyle}>
            ข้อมูลปกติ ({categorizedCats.active.length})
          </h2>
          {categorizedCats.active.length > 0 ? (
            <div style={catGridWrapper}>
              {categorizedCats.active.map((cat) => (
                <CatCard
                  key={cat.id}
                  catId={cat.id}
                  onClick={(id) => router.push(`/cat/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div style={emptyBox}>ไม่พบข้อมูลแมว</div>
          )}

          {categorizedCats.pending.length > 0 && (
            <p style={bottomReminderStyle}>
              * น้องแมวที่ไม่ได้อัปเดตเกิน 30 วัน จะแสดงผลในส่วน "รอการอัปเดต"
              ด้านล่าง
            </p>
          )}
        </div>

        <div style={sectionContainer}>
          <div style={warningHeaderRow}>
            <h2 style={sectionHeaderStyle}>
              รอการอัปเดต ({categorizedCats.pending.length})
            </h2>
            <span style={warningBadge}>ใกล้หมดอายุ</span>
          </div>

          {categorizedCats.pending.length > 0 ? (
            <div style={catGridWrapper}>
              {categorizedCats.pending.map((cat) => (
                <div key={cat.id} style={pendingCardStack}>
                  <CatCard
                    catId={cat.id}
                    onClick={(id) => router.push(`/cat/${id}`)}
                  />
                  <div style={expiryNotice}>
                    ลบถาวรใน{" "}
                    <span style={{ color: "#FF146E" }}>
                      {cat.daysRemaining}
                    </span>{" "}
                    วัน
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyBox}>ไม่มีน้องแมวที่รอการอัปเดต</div>
          )}
        </div>

        {myCats.length === 0 && (
          <div style={noDataFull}>
            <p style={{ color: "#8F8362", marginBottom: "20px" }}>
              คุณยังไม่ได้เพิ่มน้องแมวเข้าระบบเลยครับ
            </p>
            <button onClick={() => router.push("/add")} style={primaryBtn}>
              เพิ่มแมวตัวแรก
            </button>
          </div>
        )}
      </section>

      {isInfoModalOpen && (
        <div style={modalOverlay} onClick={() => setIsInfoModalOpen(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>เงื่อนไขการรักษาข้อมูล</h3>
            <div style={modalDivider} />
            <div style={modalBodyStyle}>
              • แมวประเภท <strong>Community</strong>{" "}
              หากไม่มีการรายงานการพบเห็นเกิน <strong>30 วัน</strong>{" "}
              จะถูกย้ายมาที่ส่วน "รอการอัปเดต"
              <br />
              <br />• หากข้อมูลไม่มีการเคลื่อนไหวเกิน <strong>
                60 วัน
              </strong>{" "}
              ระบบจะทำการลบข้อมูลออกจากแผนที่โดยถาวรเพื่อความสดใหม่ของข้อมูล
              <br />
              <br />• แมวประเภท <strong>Official</strong>{" "}
              จะได้รับการบันทึกข้อมูลถาวร
            </div>
            <button
              onClick={() => setIsInfoModalOpen(false)}
              style={closeModalBtn}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const FONT_VAR = "var(--font-noto-looped)";
const PINK_ACCENT = "#FF146E";

const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  background: "#F5F0E6",
  padding: "24px 20px 80px 20px",
  fontFamily: FONT_VAR,
};
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};
const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 400,
  margin: 0,
};
const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "26px",
  cursor: "pointer",
  padding: 0,
};
const infoIconBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#8F8362",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "5px",
};

const searchWrapper: React.CSSProperties = { marginBottom: "24px" };
const contentWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
};
const sectionContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 400,
  margin: 0,
  color: "#333",
};
const bottomReminderStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#8F8362",
  marginTop: "4px",
  fontStyle: "italic",
};

const catGridWrapper: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  width: "100%",
};
const pendingCardStack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const expiryNotice: React.CSSProperties = {
  fontSize: "10px",
  background: "#FFF",
  border: `0.6px solid ${PINK_ACCENT}`,
  borderRadius: "8px",
  padding: "5px",
  textAlign: "center",
  color: "#8F8362",
};

const warningHeaderRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
const warningBadge: React.CSSProperties = {
  background: PINK_ACCENT,
  color: "#FFF",
  fontSize: "10px",
  padding: "2px 10px",
  borderRadius: "12px",
};

const emptyBox: React.CSSProperties = {
  width: "100%",
  padding: "24px 16px",
  border: "1.5px dashed #D2CCBB",
  borderRadius: "16px",
  textAlign: "center",
  color: "#8F8362",
  fontSize: "13px",
  boxSizing: "border-box",
};

const noDataFull: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "40px",
};
const primaryBtn: React.CSSProperties = {
  background: "#8F8362",
  color: "#FFF",
  border: "none",
  padding: "12px 30px",
  borderRadius: "24px",
  cursor: "pointer",
  fontSize: "14px",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  color: "#8F8362",
  fontFamily: FONT_VAR,
};

// --- ✨ Modal Styles ---
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  padding: "20px",
};
const modalContent: React.CSSProperties = {
  background: "#FFF",
  padding: "24px",
  borderRadius: "20px",
  maxWidth: "320px",
  width: "100%",
  border: `2px solid ${PINK_ACCENT}`,
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
};
const modalTitleStyle: React.CSSProperties = {
  marginTop: 0,
  fontWeight: 400,
  color: "#000",
  textAlign: "center",
};
const modalDivider: React.CSSProperties = {
  height: "1px",
  background: "#EEE",
  margin: "12px 0 20px 0",
};
const modalBodyStyle: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "1.6",
  margin: 0,
  color: "#000",
};
const closeModalBtn: React.CSSProperties = {
  width: "100%",
  marginTop: "24px",
  padding: "12px",
  background: PINK_ACCENT,
  color: "#FFF",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 400,
};
