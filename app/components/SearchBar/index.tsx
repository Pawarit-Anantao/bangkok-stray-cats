"use client";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "ค้นหาชื่อน้องแมว...", 
  value, 
  onChange,
  className = ""
}: SearchBarProps) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        width: '336px',           // 📏 ความกว้างตามสเปก
        height: '42px',          // 📏 ความสูงตามสเปก
        margin: '0 auto',        // จัดกึ่งกลางหน้าจอ
        alignItems: 'center',
        position: 'relative',
        borderRadius: '32px',    // 🟢 ความโค้งมนตามสเปก
        border: '1px solid #8F8362', // 🎨 สีขอบตามสเปก
        background: '#FFF',      // ⚪️ พื้นหลังขาว
        overflow: 'hidden'
      }}
    >
      {/* ⌨️ ช่อง Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          height: '100%',
          border: 'none',
          outline: 'none',
          padding: '0 45px 0 20px', // เว้นขวาไว้ให้ไอคอน 45px, ซ้าย 20px เพื่อความสวยงาม
          fontSize: '14px',
          color: '#8F8362',        // ใช้โทนสีเดียวกับขอบ
          background: 'transparent',
          fontFamily: 'inherit',
        }}
      />

      {/* 🔍 ไอคอนแว่นขยาย (วางไว้ด้านขวาตามระยะ Padding ใน Figma) */}
      <div style={{
        position: 'absolute',
        right: '9px',             // ระยะ padding 9px จากขวา
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#8F8362" strokeWidth="2"/>
          <path d="M20 20L17 17" stroke="#8F8362" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}