"use client";

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // 💡 ป้องกันไม่ให้การคลิกทะลุไปโดนแผนที่ด้านล่าง
        onClick();
      }}
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        height: '54px',
        width: '54px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: '#5180CE',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // ปรับเงาให้นุ่มนวลขึ้น
        cursor: 'pointer',
        border: 'none',
        color: '#FFF',
        pointerEvents: 'auto', // 💡 สำคัญ: บังคับให้ปุ่มรับคำสั่งคลิกได้แน่นอน
        transition: 'transform 0.1s ease', // 💡 แก้จาก 'active' เป็น 'ease'
        WebkitTapHighlightColor: 'transparent', // ลบสีไฮไลท์เวลาจิ้มบนมือถือ
      }}
      // เอฟเฟกต์ตอนกด
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      // เพิ่มสำหรับมือถือ (Touch)
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  );
}