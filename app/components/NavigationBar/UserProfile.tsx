"use client";

import Image from "next/image";

// ✨ ไอคอนคนเริ่มต้น (แบบเดียวกับหน้า Account)
const DefaultPersonIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
    <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8"/>
  </svg>
);

export default function UserProfile({ 
  isLoggedIn, 
  avatarUrl 
}: { 
  isLoggedIn: boolean; 
  avatarUrl?: string | null;
}) {
  if (isLoggedIn) {
    return (
      // ✨ ปรับจาก border-2 เป็น border เพื่อลดความหนาลงครึ่งนึง
      <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0 rounded-full overflow-hidden border border-white/20 bg-white/10">
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt="User" 
            width={48} 
            height={48} 
            className="object-cover w-full h-full" 
          />
        ) : (
          <DefaultPersonIcon size={24} />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-[48px] h-[48px] shrink-0 rounded-full bg-white/5 border border-white/10">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="white" strokeOpacity="0.2" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}