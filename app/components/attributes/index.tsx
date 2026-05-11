"use client";

import { useState } from "react";
import TagDisplayBox from "../TagDisplayBox";
import TagChip from "../TagChip";
import TagSelectionWindow from "../TagSelectionWindow";
import CategoryGrid from "../CategoryGrid"; 
import FormField from "../FormField";
import AggressivenessSelector from "../AggressivenessSelector";

// ✨ กำหนด Interface ให้ตรงกับที่หน้าหลักส่งมา
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
  setExtraInfo
}: AttributeSectionProps) {
  
  // 🟢 activeCategory เก็บไว้ที่นี่ได้ เพราะใช้แค่คุมการเปิด/ปิดหน้าต่างเลือก Tag ในตัวมันเอง
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Logic การ Toggle (ปรับให้ใช้ setSelectedTags จาก props)
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

  const categories = [
    { id: 'pattern', label: 'เลือกลาย' }, { id: 'color', label: 'เลือกสี' },
    { id: 'fur_length', label: 'ลักษณะขน' }, { id: 'size', label: 'ขนาด' },
    { id: 'gender', label: 'เพศ' }, { id: 'health', label: 'ข้อมูลสุขภาพ' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '334px', margin: '0 auto' }}>
      
      {/* 🏷️ Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'normal', fontFamily: 'var(--font-noto-looped)' }}>เพิ่มลักษณะแมว</h2>
        <span style={{ fontSize: '11px', color: '#8F8362', fontFamily: 'var(--font-noto-looped)' }}>สามารถเลือกได้หลายลักษณะ</span>
      </div>

      {/* 📦 Tag Display Area */}
      <TagDisplayBox>
        {Object.entries(selectedTags).map(([cat, keys]) => 
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
        )}
      </TagDisplayBox>

      {/* 🗂️ Grid Buttons */}
      <CategoryGrid 
        onOpenSelector={(catId) => setActiveCategory(catId)}
        selectedCounts={Object.fromEntries(
          Object.entries(selectedTags).map(([cat, tags]) => [cat, tags.length])
        )}
      />

      {/* 📝 Textareas เดิม */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="รายละเอียดลักษณะเพิ่มเติม">
          <textarea 
            placeholder="หน้าตาน่ารัก, พุงจะย้วยลงมา..." 
            style={textareaStyle} 
            value={catInfo}
            onChange={(e) => setCatInfo(e.target.value)}
          />
        </FormField>
        <FormField label="รายละเอียดด้านสุขภาพ">
          <textarea 
            placeholder="น้องเดินเซๆ อาจจะอ้วนเกิน" 
            style={textareaStyle} 
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}
          />
        </FormField>
      </div>

      {/* ✨ ระดับความดุ */}
      <AggressivenessSelector 
        selectedLevel={aggressiveness}
        onSelect={(level) => setAggressiveness(level)}
      />

      {/* 📝 คำอธิบายเพิ่มเติม (หัวข้อใหญ่) */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'normal', 
          fontFamily: 'var(--font-noto-looped)',
          margin: 0 
        }}>
          คำอธิบายเพิ่มเติม
        </h2>
        <textarea 
          placeholder="ระบุรายละเอียดอื่นๆ เช่น จุดที่พบเจอครั้งสุดท้าย หรือข้อมูลที่คุณอยากบอก..." 
          style={textareaStyle} 
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />
      </div>

      {/* 🪟 Selection Window */}
      {activeCategory && (
        <TagSelectionWindow 
          categoryLabel={categories.find(c => c.id === activeCategory)?.label || ""}
          tags={allTags.filter(t => t.category === activeCategory)}
          selectedKeys={selectedTags[activeCategory]}
          onToggle={(key) => handleToggle(activeCategory, key)}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}

const textareaStyle: React.CSSProperties = { 
  width: '100%', 
  minHeight: '80px', 
  padding: '12px', 
  borderRadius: '12px', 
  border: '1.5px solid #D2CCBB', 
  background: '#F7F7F7', 
  fontFamily: 'var(--font-noto-looped)', 
  fontSize: '14px', 
  resize: 'none',
  boxSizing: 'border-box', 
  outline: 'none' 
};