"use client";

import { useState } from "react";

interface TagSelectionWindowProps {
  categoryLabel: string;
  tags: any[];
  selectedKeys: string[];
  onToggle: (key: string) => void;
  onClose: () => void;
}

export default function TagSelectionWindow({ categoryLabel, tags, selectedKeys, onToggle, onClose }: TagSelectionWindowProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const FONT_VARIABLE = "var(--font-noto-looped), sans-serif";

  // Logic การค้นหา
  const filteredTags = tags.filter(t => 
    t.label_th.includes(searchTerm) || t.label_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={overlayStyle}>
      <div style={windowStyle}>
        <div style={headerStyle}>
          {/* ✨ เปลี่ยนจาก Bold เป็น Normal */}
          <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{categoryLabel}</span>
          <button onClick={onClose} style={closeButtonStyle}>ปิด</button>
        </div>

        {/* ช่องค้นหา (Search Input) */}
        <div style={searchWrapper}>
          <input 
            type="text" 
            placeholder={`ค้นหา${categoryLabel}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* รายการ Tags ให้เลือก */}
        <div style={listStyle}>
          {filteredTags.map(tag => (
            <button 
              key={tag.key} 
              onClick={() => onToggle(tag.key)}
              style={tagButtonStyle(selectedKeys.includes(tag.key))}
            >
              {tag.label_th}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };

const windowStyle: React.CSSProperties = { 
  width: '90%', 
  maxWidth: '320px', 
  background: '#FFF', 
  borderRadius: '16px', 
  padding: '20px', 
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
  fontFamily: 'var(--font-noto-looped)',
  boxSizing: 'border-box' // ✨ กันเหนียวไว้ที่ตัวหน้าต่างด้วย
};

const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };

const closeButtonStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#8F8362', fontSize: '14px', fontFamily: 'var(--font-noto-looped)' };

const searchWrapper: React.CSSProperties = { marginBottom: '16px', width: '100%' };

const searchInputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '10px 12px', 
  borderRadius: '99px', 
  border: '1.5px solid #D2CCBB', 
  outline: 'none', 
  fontSize: '14px',
  fontFamily: 'var(--font-noto-looped)',
  boxSizing: 'border-box' // ✨ ตัวจบปัญหาช่องค้นหาล้นขอบ!
};

const listStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' };

const tagButtonStyle = (isSelected: boolean): React.CSSProperties => ({
  padding: '6px 14px', 
  borderRadius: '20px', 
  border: `1.5px solid ${isSelected ? '#8F8362' : '#D2CCBB'}`,
  background: isSelected ? '#8F8362' : '#F7F7F7', 
  color: isSelected ? '#FFF' : '#333', 
  cursor: 'pointer', 
  fontSize: '13px',
  fontFamily: 'var(--font-noto-looped)',
  fontWeight: 'normal', // ✨ มั่นใจว่าฟอนต์ปุ่มเป็นตัวปกติ
  transition: 'all 0.2s ease'
});