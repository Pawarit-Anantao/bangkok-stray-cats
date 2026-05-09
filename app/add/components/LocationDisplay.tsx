"use client";

interface LocationDisplayProps {
  lat: number;
  lng: number;
}

export default function LocationDisplay({ lat, lng }: LocationDisplayProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8F8362' }}>ตำแหน่งที่ปักหมุด</label>
      <div style={{
        width: '100%', height: '48px', background: '#E8F0FE', borderRadius: '12px',
        display: 'flex', alignItems: 'center', padding: '0 16px', color: '#5180CE',
        fontWeight: 'bold', fontSize: '14px', border: '1px solid #C0D6F9', boxSizing: 'border-box'
      }}>
        <span>📍 {lat.toFixed(6)}, {lng.toFixed(6)}</span>
      </div>
    </div>
  );
}