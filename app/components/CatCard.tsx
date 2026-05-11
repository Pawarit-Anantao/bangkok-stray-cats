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

export default function CatCard({ catId, onBookmarkClick, onClick }: CatCardProps) {
  const [cat, setCat] = useState<any>(null);
  const [displayTags, setDisplayTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function fetchFullCatData() {
      try {
        setLoading(true);
        
        // 1. ดึงข้อมูลแมวและรูปภาพ
        const { data: catData, error: catError } = await supabase
          .from('cats')
          .select(`
            *,
            cat_photos(public_url, is_primary)
          `)
          .eq('id', catId)
          .single();

        if (catError) throw catError;

        // 2. ดึงข้อมูล Tag ภาษาไทยจาก DB (ห้าม Hardcode)
        // สร้าง Array ของ Key ที่เราต้องการหา Label ภาษาไทย
        const tagKeys = [catData.pattern, catData.color, catData.gender].filter(
          (key) => key && key !== "unknown"
        );

        if (tagKeys.length > 0) {
          const { data: tagData } = await supabase
            .from('cat_tags')
            .select('category, key, label_th')
            .in('key', tagKeys);
          
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

  if (loading) return <div style={{ ...cardContainerStyle, background: '#F5F5F5' }} />;
  if (!cat) return null;

  const primaryPhoto = cat.cat_photos?.find((p: any) => p.is_primary)?.public_url 
                    || cat.cat_photos?.[0]?.public_url;

  return (
    <div style={cardContainerStyle} onClick={() => onClick?.(cat.id)}>
      {/* 🖼️ ส่วนรูปภาพ (55% ≈ 123px) */}
      <div 
        style={{
          ...imageSectionStyle,
          backgroundImage: `url(${primaryPhoto || "/images/placeholder-cat.jpg"})`,
        }}
      >
        <div style={pawsWrapperStyle} onClick={(e) => {
          e.stopPropagation();
          setIsBookmarked(!isBookmarked);
          onBookmarkClick?.(cat.id);
        }}>
          <CatPaws size="small" isActive={isBookmarked} />
        </div>
      </div>

      {/* 📝 ส่วนข้อมูล (45% ≈ 101px) */}
      <div style={infoSectionStyle}>
        <div style={headerStackStyle}>
          <div style={catNameStyle}>{cat.name || "น้องแมวไม่มีชื่อ"}</div>
          <div style={locationStyle}>
            {cat.address_name || "ไม่ระบุเขต"}, กรุงเทพฯ
          </div>
        </div>

        {/* รายละเอียดแมว (จำกัด 2 บรรทัด) */}
        <div style={descriptionStyle}>
          {cat.description || ""}
        </div>

        {/* Tags จาก DB */}
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

// --- 🎨 Styles (Lock 224x161, Ratio 55/45) ---

const cardContainerStyle: React.CSSProperties = {
  display: 'flex',
  width: '161px',
  height: '224px', // ล็อคความสูงตามสั่ง
  flexDirection: 'column',
  borderRadius: '12px',
  background: '#FFF',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  cursor: 'pointer',
};

const imageSectionStyle: React.CSSProperties = {
  display: 'flex',
  height: '123px', // 55% ของ 224px
  padding: '8px',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#EAEAEA',
  position: 'relative',
};

const pawsWrapperStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  zIndex: 2,
};

const infoSectionStyle: React.CSSProperties = {
  display: 'flex',
  height: '101px', // 45% ของ 224px
  padding: '10px 12px',
  flexDirection: 'column',
  justifyContent: 'space-between', // กระจายเนื้อหาให้เต็มพื้นที่ 45%
  alignItems: 'flex-start',
  alignSelf: 'stretch',
};

const headerStackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  width: '100%',
};

const catNameStyle: React.CSSProperties = {
  color: '#222',
  fontFamily: '"Noto Looped Thai", sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const locationStyle: React.CSSProperties = {
  color: '#888',
  fontFamily: '"Noto Looped Thai", sans-serif',
  fontSize: '9px',
  fontWeight: 400,
};

const descriptionStyle: React.CSSProperties = {
  color: '#555',
  fontFamily: '"Noto Looped Thai", sans-serif',
  fontSize: '10px',
  lineHeight: '1.4',
  height: '28px', // ประมาณ 2 บรรทัด
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  margin: '4px 0',
} as any; // ใช้ as any เพราะ Webkit properties บางอัน TS มองไม่เห็น

const tagContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  width: '100%',
  overflow: 'hidden',
};

const miniTagWrapper: React.CSSProperties = {
  transform: 'scale(0.7)', // ย่อลงอีกนิดเพื่อให้ยัด 3 อันไหวในความกว้าง 161px
  transformOrigin: 'left center',
  marginRight: '-12px', 
};