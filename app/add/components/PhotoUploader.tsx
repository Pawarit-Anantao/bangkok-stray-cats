"use client";

export default function PhotoUploader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8F8362' }}>รูปภาพน้องแมว</label>
      <div style={{
        width: '80px', height: '80px', background: '#FFF', borderRadius: '12px',
        border: '2px dashed #D2CCBB', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#8F8362', cursor: 'pointer'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8F8362" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span style={{ fontSize: '12px', marginTop: '4px' }}>เพิ่มรูปภาพ</span>
      </div>
    </div>
  );
}