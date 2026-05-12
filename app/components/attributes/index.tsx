"use client";

import { useState } from "react";
import TagDisplayBox from "../TagDisplayBox";
import TagChip from "../TagChip";
import TagSelectionWindow from "../TagSelectionWindow";
import CategoryGrid from "../CategoryGrid"; 
import FormField from "../FormField";
import AggressivenessSelector from "../AggressivenessSelector";

interface AttributeSectionProps {
  allTags: any[];
  selectedTags: { [key: string]: string[] };
  setSelectedTags: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  aggressiveness: string | null;
  setAggressiveness: (level: string) => void;
  catInfo: string;
  setCatInfo: (val: string) => void;
  healthInfo: string;
  setHealthInfo: (val: string) => void;
  extraInfo: string;
  setExtraInfo: (val: string) => void;
  isSightingMode?: boolean;
}

export default function AttributeSection({ 
  allTags, 
  selectedTags, 
  setSelectedTags,
  aggressiveness,
  setAggressiveness,
  catInfo,
  setCatInfo,
  healthInfo,
  setHealthInfo,
  extraInfo,
  setExtraInfo,
  isSightingMode = false
}: AttributeSectionProps) {
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleToggle = (category: string, key: string) => {
    setSelectedTags(prev => {
      const current = prev[category] || [];
      if (key === 'unknown') return { ...prev, [category]: ['unknown'] };
      let next = current.filter(k => k !== 'unknown');
      if (next.includes(key)) {
        next = next.filter(k => k !== key);
      } else if (next.length < 3) {
        next = [...next, key];
      }
      return { ...prev, [category]: next };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '334px', margin: '0 auto' }}>
      
      {/* 🏷️ ส่วนการเลือก Tag สุขภาพ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={sectionTitleStyle}>
          {isSightingMode ? "ข้อมูลสุขภาพแมว" : "เพิ่มลักษณะแมว"}
        </h2>
        {!isSightingMode && (
          <span style={{ fontSize: '11px', color: '#8F8362', fontFamily: 'var(--font-noto-looped)', fontWeight: 400 }}>
            สามารถเลือกได้หลายลักษณะ
          </span>
        )}
      </div>

      <TagDisplayBox>
        {Object.entries(selectedTags)
          .filter(([cat]) => !isSightingMode || cat === 'health') 
          .map(([cat, keys]) => 
            keys.map(key => {
              const tag = allTags.find(t => t.category === cat && t.key === key);
              return tag ? (
                <TagChip 
                  key={`${cat}-${key}`} 
                  label={tag.label_th} 
                  category={cat}
                  onRemove={() => handleToggle(cat, key)} 
                />
              ) : null;
            })
          )
        }
      </TagDisplayBox>

      {isSightingMode ? (
        <button onClick={() => setActiveCategory('health')} style={healthSelectBtnStyle}>
          + เลือกอาการ/ป้ายกำกับสุขภาพ
        </button>
      ) : (
        <CategoryGrid 
          onOpenSelector={(catId) => setActiveCategory(catId)}
          selectedCounts={Object.fromEntries(
            Object.entries(selectedTags).map(([cat, tags]) => [cat, tags.length])
          )}
        />
      )}

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {!isSightingMode && (
          <FormField label="รายละเอียดลักษณะเพิ่มเติม">
            <textarea 
              placeholder="หน้าตาน่ารัก, พุงจะย้วยลงมา..." 
              style={textareaStyle} 
              value={catInfo}
              onChange={(e) => setCatInfo(e.target.value)}
            />
          </FormField>
        )}

        <FormField label="รายละเอียดด้านสุขภาพ">
          <textarea 
            placeholder="น้องมีแผลที่ขา, ตาเจ็บ..." 
            style={textareaStyle} 
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}
          />
        </FormField>
      </div>


      {/* 📝 ข้อมูลเพิ่มเติมจากการพบเห็น (ขนาดหัวข้อ 15px) */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={sectionTitleStyle}>ข้อมูลเพิ่มเติมจากการพบเห็น</h2>
        <textarea 
          placeholder="พบน้องที่พุ่มไม้หลังตึก..." 
          style={textareaStyle} 
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>

      {/* ✨ ประสบการณ์ความดุ (เพิ่มหัวข้อขนาด 15px) */}
      <div style={{ marginTop: '-15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AggressivenessSelector 
          selectedLevel={aggressiveness}
          onSelect={(level) => setAggressiveness(level)}
        />
      </div>

      {activeCategory && (
        <TagSelectionWindow 
          categoryLabel={activeCategory === 'health' ? 'ข้อมูลสุขภาพ' : ''}
          tags={allTags.filter(t => t.category === activeCategory)}
          selectedKeys={selectedTags[activeCategory]}
          onToggle={(key) => handleToggle(activeCategory, key)}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}

// --- 🎨 Styles ---
const sectionTitleStyle: React.CSSProperties = { 
  fontSize: '15px', // ✨ ลดจาก 20px เหลือ 15px เท่ากับรายละเอียดด้านสุขภาพ
  fontWeight: 400, 
  fontFamily: 'var(--font-noto-looped)', 
  margin: 0 
};

const textareaStyle: React.CSSProperties = { 
  width: '100%', minHeight: '80px', padding: '12px', borderRadius: '12px', 
  border: '1.5px solid #D2CCBB', background: '#F7F7F7', 
  fontFamily: 'var(--font-noto-looped)', fontSize: '14px', fontWeight: 400,
  resize: 'none', boxSizing: 'border-box', outline: 'none' 
};

const healthSelectBtnStyle: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px dashed #D2CCBB',
  background: '#FFF', color: '#8F8362', fontFamily: 'var(--font-noto-looped)',
  fontSize: '14px', fontWeight: 400, cursor: 'pointer', textAlign: 'center'
};