"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import CatPaws from "./CatPaws";
import TagChip from "./TagChip";

interface CatCardProps {
  catId: string;
  onBookmarkClick?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function CatCard({
  catId,
  onBookmarkClick,
  onClick,
}: CatCardProps) {
  const [cat, setCat] = useState<any>(null);
  const [displayTags, setDisplayTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFullCatData() {
      try {
        setLoading(true);

        // 1. ดึง User ID ปัจจุบัน
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        setCurrentUserId(userId);

        // 2. ดึงข้อมูลแมวและรูปภาพ
        const { data: catData, error: catError } = await supabase
          .from("cats")
          .select(`*, cat_photos(public_url, is_primary)`)
          .eq("id", catId)
          .single();

        if (catError) throw catError;

        // 3. ✨ ดึงสถานะ Bookmark จริงจาก DB (เพื่อให้ซิงค์กับหน้า Profile)
        if (userId) {
          const { data: bookmark } = await supabase
            .from("cat_bookmarks")
            .select("id")
            .eq("cat_id", catId)
            .eq("user_id", userId)
            .maybeSingle();
          setIsBookmarked(!!bookmark);
        }

        // 4. ดึงข้อมูล Tag
        const tagKeys = [catData.pattern, catData.color, catData.gender].filter(
          (key) => key && key !== "unknown",
        );

        if (tagKeys.length > 0) {
          const { data: tagData } = await supabase
            .from("cat_tags")
            .select("category, key, label_th")
            .in("key", tagKeys);

          if (tagData) setDisplayTags(tagData);
        }

        setCat(catData);
      } catch (err) {
        console.error("Error loading CatCard:", err);
      } finally {
        setLoading(false);
      }
    }

    if (catId) fetchFullCatData();
  }, [catId]);

  // ✨ ฟังก์ชันจัดการ Bookmark ที่เชื่อมกับ Database
  const handlePawsClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // กันไม่ให้กดแล้วเด้งไปหน้า Profile
    if (!currentUserId) return alert("กรุณาเข้าสู่ระบบก่อนบันทึกนะครับ");

    try {
      if (isBookmarked) {
        await supabase
          .from("cat_bookmarks")
          .delete()
          .eq("cat_id", catId)
          .eq("user_id", currentUserId);
      } else {
        await supabase
          .from("cat_bookmarks")
          .insert({ cat_id: catId, user_id: currentUserId });
      }
      setIsBookmarked(!isBookmarked);
      onBookmarkClick?.(catId);
    } catch (err) {
      console.error("Error bookmarking:", err);
    }
  };

  if (loading)
    return <div style={{ ...cardContainerStyle, background: "#F5F5F5" }} />;
  if (!cat) return null;

  const primaryPhoto =
    cat.cat_photos?.find((p: any) => p.is_primary)?.public_url ||
    cat.cat_photos?.[0]?.public_url;

  return (
    <div style={cardContainerStyle} onClick={() => onClick?.(cat.id)}>
      <div
        style={{
          ...imageSectionStyle,
          backgroundImage: `url(${primaryPhoto || "/images/placeholder-cat.jpg"})`,
        }}
      >
        <div style={pawsWrapperStyle} onClick={handlePawsClick}>
          <CatPaws size="small" isActive={isBookmarked} />
        </div>
      </div>

      <div style={infoSectionStyle}>
        <div style={headerStackStyle}>
          <div style={catNameStyle}>{cat.name || "น้องแมวไม่มีชื่อ"}</div>
          <div style={locationStyle}>
            {cat.address_name || "ไม่ระบุเขต"}, กรุงเทพฯ
          </div>
        </div>

        <div style={descriptionStyle}>{cat.description || ""}</div>

        <div style={tagContainerStyle}>
          {displayTags.map((tag) => (
            <div key={tag.key} style={miniTagWrapper}>
              <TagChip
                label={tag.label_th}
                category={tag.category}
                size="small"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 🎨 Styles (Font 400 & Variable) ---

const FONT_VAR = "var(--font-noto-looped)";

const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  width: "161px",
  height: "224px",
  flexDirection: "column",
  borderRadius: "12px",
  background: "#FFF",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  cursor: "pointer",
};

const imageSectionStyle: React.CSSProperties = {
  display: "flex",
  height: "123px",
  padding: "8px",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  alignSelf: "stretch",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#EAEAEA",
  position: "relative",
};

const pawsWrapperStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  zIndex: 2,
};

const infoSectionStyle: React.CSSProperties = {
  display: "flex",
  height: "101px",
  padding: "10px 12px",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

const headerStackStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  width: "100%",
};

const catNameStyle: React.CSSProperties = {
  color: "#222",
  fontFamily: FONT_VAR,
  fontSize: "13px",
  fontWeight: 400, // ปรับตามสั่ง
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const locationStyle: React.CSSProperties = {
  color: "#888",
  fontFamily: FONT_VAR,
  fontSize: "9px",
  fontWeight: 400,
};

const descriptionStyle: React.CSSProperties = {
  color: "#555",
  fontFamily: FONT_VAR,
  fontSize: "10px",
  fontWeight: 400,
  lineHeight: "1.4",
  height: "28px",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  margin: "4px 0",
} as any;

const tagContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  width: "100%",
  overflow: "hidden",
};

const miniTagWrapper: React.CSSProperties = {
  transform: "scale(0.7)",
  transformOrigin: "left center",
  marginRight: "-12px",
};
