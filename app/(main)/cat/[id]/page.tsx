"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Components
import Button from "@/components/Button";
import TagChip from "@/components/TagChip";
import SightingInfoBox from "@/components/SightingInfoBox";
import CatPaws from "@/components/CatPaws";

export default function CatProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [cat, setCat] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [addedByUsername, setAddedByUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [avgAggression, setAvgAggression] = useState<number>(3.0);

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      setCurrentUserId(userId);
      await fetchCatData(userId);
    };
    init();
  }, [id]);

  const fetchCatData = async (userId: string | null) => {
    try {
      setLoading(true);
      const { data: catData, error: catError } = await supabase
        .from("cats")
        .select("*")
        .eq("id", id)
        .single();
      if (catError) throw catError;

      const { data: sightings } = await supabase
        .from("cat_sightings")
        .select("aggression_score")
        .eq("cat_id", id)
        .not("aggression_score", "is", null);

      if (sightings && sightings.length > 0) {
        const sum = sightings.reduce(
          (acc, curr) => acc + (curr.aggression_score || 0),
          0,
        );
        setAvgAggression(sum / sightings.length);
      } else {
        setAvgAggression(Number(catData.last_aggression_score) || 3.0);
      }

      if (catData.added_by) {
        const { data: userData } = await supabase
          .from("users")
          .select("username")
          .eq("id", catData.added_by)
          .single();
        setAddedByUsername(userData?.username || "ผู้ใช้ทั่วไป");
      }

      if (userId) {
        const { data: bookmark } = await supabase
          .from("cat_bookmarks")
          .select("id")
          .eq("cat_id", id)
          .eq("user_id", userId)
          .maybeSingle();
        setIsBookmarked(!!bookmark);
      }

      const { data: photoData } = await supabase
        .from("cat_photos")
        .select("public_url")
        .eq("cat_id", id);

      const physicalKeys = [
        catData.pattern,
        catData.color,
        catData.gender,
        catData.fur_length,
        catData.size,
      ].filter((k) => k && k !== "unknown");
      const healthKeys = catData.last_health_tags
        ? catData.last_health_tags.split(",")
        : [];
      const combinedKeys = Array.from(
        new Set([...physicalKeys, ...healthKeys]),
      );
      const { data: tagData } = await supabase
        .from("cat_tags")
        .select("*")
        .in("key", combinedKeys);

      setCat(catData);
      setPhotos(photoData || []);
      setTags(tagData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("cats")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      router.push("/my-cats");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return alert("กรุณาเข้าสู่ระบบก่อนบันทึกน้องแมวครับ");
    try {
      if (isBookmarked) {
        await supabase
          .from("cat_bookmarks")
          .delete()
          .eq("cat_id", id)
          .eq("user_id", currentUserId);
      } else {
        await supabase
          .from("cat_bookmarks")
          .insert({ cat_id: id, user_id: currentUserId });
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const aggressionInfo = useMemo(() => {
    const score = avgAggression;
    let label = "ปกติ";
    let icon = "normal";
    let color = "#FFE082";
    if (score <= 1.3) {
      label = "เชื่องมาก";
      icon = "very_friendly";
      color = "#A5D6A7";
    } else if (score <= 1.7) {
      label = "ค่อนข้างเชื่องมาก";
      icon = "very_friendly";
      color = "#A5D6A7";
    } else if (score <= 2.1) {
      label = "ค่อนข้างเชื่อง";
      icon = "chill";
      color = "#C5E1A5";
    } else if (score <= 2.5) {
      label = "เชื่อง";
      icon = "chill";
      color = "#C5E1A5";
    } else if (score <= 2.9) {
      label = "ค่อนข้างปกติ";
      icon = "normal";
      color = "#FFE082";
    } else if (score <= 3.3) {
      label = "ปกติ";
      icon = "normal";
      color = "#FFE082";
    } else if (score <= 3.7) {
      label = "ค่อนข้างกลัวคน";
      icon = "timid";
      color = "#FFCC80";
    } else if (score <= 4.1) {
      label = "กลัวคน";
      icon = "timid";
      color = "#FFCC80";
    } else if (score <= 4.5) {
      label = "ค่อนข้างดุ";
      icon = "fierce";
      color = "#EF9A9A";
    } else {
      label = "ดุ";
      icon = "fierce";
      color = "#EF9A9A";
    }
    return { label, icon, color, score };
  }, [avgAggression]);

  if (loading)
    return <div style={loadingStyle}>กำลังเรียกข้อมูลน้องแมว...</div>;

  return (
    <main style={mainLayout}>
      <section style={photoSectionStyle} onClick={() => setIsFullscreen(true)}>
        <img
          src={photos[currentPhotoIndex]?.public_url || "/placeholder-cat.jpg"}
          style={catImageStyle}
          alt="Cat"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhotoIndex(
                  (p) => (p - 1 + photos.length) % photos.length,
                );
              }}
              style={{ ...navBtnStyle, left: "10px" }}
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhotoIndex((p) => (p + 1) % photos.length);
              }}
              style={{ ...navBtnStyle, right: "10px" }}
            >
              ›
            </button>
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.back();
          }}
          style={backBtn}
        >
          ←
        </button>
        <div style={photoIndicatorStyle}>
          {currentPhotoIndex + 1}/{photos.length}
        </div>
      </section>

      <section style={contentWrapper}>
        <div style={innerContent}>
          <div style={headerRowStyle}>
            <div style={nameAndUserStack}>
              <div style={nameRowStyle}>
                <h1 style={catNameTitleStyle}>
                  {cat.name || "น้องแมวไม่มีชื่อ"}
                </h1>
                {currentUserId === cat.added_by && (
                  <span
                    onClick={() => router.push(`/cat/${id}/edit`)}
                    style={editLinkStyle}
                  >
                    แก้ไข
                  </span>
                )}
              </div>
              <span style={addedBySubtextStyle}>
                เพิ่มโดย{" "}
                {currentUserId === cat.added_by ? "คุณ" : addedByUsername}
              </span>
            </div>
            <div style={catPawsWrapperStyle}>
              <CatPaws
                size="large"
                isActive={isBookmarked}
                onClick={handleBookmarkToggle}
              />
            </div>
          </div>

          <div style={bodyFlowContainer}>
            <div style={sectionContainerStyle}>
              <h2 style={sectionHeaderStyle}>คำอธิบายแมว</h2>
              <div style={grayBoxStyle}>
                <p style={boxTextStyle}>
                  {cat.description || cat.identifying_marks || "ไม่มีคำอธิบาย"}
                </p>
              </div>
            </div>

            {cat.last_health_note && (
              <div style={sectionContainerStyle}>
                <h2 style={sectionHeaderStyle}>บันทึกสุขภาพล่าสุด</h2>
                <div style={{ ...grayBoxStyle, border: "2px solid #94AE2C" }}>
                  <p style={boxTextStyle}>{cat.last_health_note}</p>
                </div>
              </div>
            )}

            <SightingInfoBox
              title="การพบล่าสุด"
              actionText="ข้อมูลการพบทั้งหมด"
              actionUrl={`/cat/${id}/history`}
              sightingData={{
                id: cat.id,
                district: cat.address_name || "ไม่ระบุเขต",
                fullAddress: cat.address_detail || "",
              }}
            />

            <div style={sectionContainerStyle}>
              <h2 style={sectionHeaderStyle}>ลักษณะและสุขภาพแมว</h2>
              <div style={tagCloudStyle}>
                {tags.map((t) => (
                  <TagChip
                    key={t.id}
                    label={t.label_th}
                    category={t.category}
                  />
                ))}
              </div>
            </div>

            <div style={sectionContainerStyle}>
              <h2 style={sectionHeaderStyle}>ค่าความดุเฉลี่ย</h2>
              <div style={aggressionBoxStyle}>
                <div style={iconFrameStyle}>
                  <img
                    src={`/${aggressionInfo.icon}.svg`}
                    alt={aggressionInfo.label}
                    style={aggressionIconStyle}
                  />
                </div>
                <div style={aggressionInfoStack}>
                  <span style={aggressionTextStyle}>
                    คะแนน {aggressionInfo.score.toFixed(2)}{" "}
                    {aggressionInfo.label}
                  </span>
                  <div style={aggressionBarBg}>
                    <div
                      style={{
                        ...aggressionBarFill,
                        width: `${(aggressionInfo.score / 5) * 100}%`,
                        backgroundColor: aggressionInfo.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={footerActionStyle}>
            <div style={bottomButtonGroupStyle}>
              <Button
                onClick={() => router.push(`/cat/${id}/report`)}
                style={{ flex: 1 }}
              >
                เพิ่มข้อมูลแมวตัวนี้
              </Button>
              {currentUserId === cat.added_by && (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  style={deleteBtnStyle}
                >
                  ลบข้อมูล
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div style={modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>ยืนยันการลบข้อมูล</h3>
            <div style={modalDivider} />
            <div style={modalBodyStyle}>
              คุณต้องการลบข้อมูลของ{" "}
              <strong>{cat.name || "น้องแมวตัวนี้"}</strong> ใช่หรือไม่?
              <br />
              <br />
              เมื่อลบแล้ว ข้อมูลจะหายไปจากแผนที่และรายการค้นหาทันที
              แต่คุณยังสามารถดูประวัติย้อนหลังได้ในหน้า "แมวของคุณ"
            </div>
            <div style={modalFooterStyle}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={cancelModalBtn}
              >
                ยกเลิก
              </button>
              <button onClick={confirmDelete} style={confirmModalBtn}>
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div style={overlayStyle} onClick={() => setIsFullscreen(false)}>
          <img
            src={photos[currentPhotoIndex]?.public_url}
            style={fullImageStyle}
            alt="Full"
          />
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              color: "white",
              fontSize: "24px",
            }}
          >
            ✕
          </div>
        </div>
      )}
    </main>
  );
}

const FONT_VAR = "var(--font-noto-looped)";
const SUB_COLOR = "#8F8362";
const PINK_ACCENT = "#FF146E";

const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  background: "#F5F0E6",
};
const photoSectionStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "307px",
  boxShadow: "0 0 22px 0 rgba(0, 0, 0, 0.25)",
  flexShrink: 0,
  overflow: "hidden",
  cursor: "pointer",
};
const catImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const navBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(255, 255, 255, 0.3)",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "24px",
  color: "white",
  cursor: "pointer",
  zIndex: 5,
};
const contentWrapper: React.CSSProperties = {
  flex: 1,
  padding: "24px 20px 50px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const innerContent: React.CSSProperties = {
  width: "100%",
  maxWidth: "345px",
  display: "flex",
  flexDirection: "column",
};

const headerRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: "16px",
  marginBottom: "22px",
};
const nameAndUserStack: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};
const nameRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
};
const catNameTitleStyle: React.CSSProperties = {
  fontSize: "26px",
  fontFamily: FONT_VAR,
  fontWeight: 400,
  color: "#000",
  margin: 0,
};
const editLinkStyle: React.CSSProperties = {
  color: SUB_COLOR,
  opacity: 0.5,
  fontSize: "13px",
  textDecoration: "underline",
  cursor: "pointer",
  fontFamily: FONT_VAR,
  fontWeight: 400,
};
const addedBySubtextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: SUB_COLOR,
  fontFamily: FONT_VAR,
  fontWeight: 400,
};
const catPawsWrapperStyle: React.CSSProperties = {
  transform: "scale(0.8)",
  transformOrigin: "right center",
  marginLeft: "-5px",
};
const bodyFlowContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const sectionContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "20px",
  fontFamily: FONT_VAR,
  fontWeight: 400,
  color: "#000",
  margin: 0,
};
const grayBoxStyle: React.CSSProperties = {
  minHeight: "30px",
  padding: "12px 15px",
  borderRadius: "12px",
  border: "2px solid #D2CCBB",
  background: "#F7F7F7",
};
const boxTextStyle: React.CSSProperties = {
  fontSize: "14px",
  fontFamily: FONT_VAR,
  fontWeight: 400,
  color: "#000",
  margin: 0,
  lineHeight: "1.4",
};
const tagCloudStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};
const aggressionBoxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "2px 0",
};
const iconFrameStyle: React.CSSProperties = {
  width: "42px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const aggressionIconStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};
const aggressionInfoStack: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};
const aggressionTextStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 400,
  fontFamily: FONT_VAR,
  color: SUB_COLOR,
};
const aggressionBarBg: React.CSSProperties = {
  width: "100%",
  height: "10px",
  background: "#EAE7E0",
  borderRadius: "12px",
  overflow: "hidden",
};
const aggressionBarFill: React.CSSProperties = {
  height: "100%",
  transition: "width 0.5s ease",
  borderRadius: "5px",
};

// ✨ ส่วนปุ่มด้านล่าง
const footerActionStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginTop: "30px",
};
const bottomButtonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  width: "100%",
  maxWidth: "340px",
};
const deleteBtnStyle: React.CSSProperties = {
  flex: "0 0 100px",
  background: "#FFF",
  border: `1.5px solid ${PINK_ACCENT}`,
  color: PINK_ACCENT,
  borderRadius: "24px",
  fontSize: "13px",
  cursor: "pointer",
  fontFamily: FONT_VAR,
};

const photoIndicatorStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "15px",
  right: "15px",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  padding: "2px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: 400,
};
const backBtn: React.CSSProperties = {
  position: "absolute",
  top: "15px",
  left: "15px",
  background: "rgba(255,255,255,0.7)",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  zIndex: 10,
};
const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  color: SUB_COLOR,
  fontFamily: FONT_VAR,
};
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const fullImageStyle: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
};

// ✨ Modal Styles (อ้างอิงจาก MyCats)
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
const modalFooterStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "24px",
};
const cancelModalBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: "#FFF",
  color: "#888",
  border: "1px solid #EEE",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
};
const confirmModalBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  background: PINK_ACCENT,
  color: "#FFF",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
};
