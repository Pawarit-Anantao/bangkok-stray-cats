"use client";

import React from "react";

interface CatMapMarkerProps {
  photoUrl?: string;
  mode?: "community" | "official";
  scale?: number; // ✨ เพิ่ม Prop สำหรับรับค่าการขยายขนาด
}

export default function CatMapMarker({ 
  photoUrl, 
  mode = "community",
  scale = 1 // ✨ กำหนดค่าเริ่มต้นเป็น 1
}: CatMapMarkerProps) {
  
  const strokeColor = mode === "community" ? "#FF146E" : "#5180CE";

  return (
    // ✨ ใช้ div หุ้มเพื่อจัดการเรื่อง Scale และ Transition
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center', // ขยายออกจากจุดแหลมด้านล่าง
      transition: 'transform 0.1s ease-out', // ให้การย่อขยายดูนุ่มนวล
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg 
        width="47" 
        height="49" 
        viewBox="0 0 47 49" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }} // ป้องกันเงาโดนขอบตัด
      >
        <defs>
          <filter 
            id="filter0_d_309_804" 
            x="0" 
            y="0" 
            width="47" 
            height="48.0996" 
            filterUnits="userSpaceOnUse" 
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="3.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.41 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_309_804"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_309_804" result="shape"/>
          </filter>

          <mask id="catMask">
            <path 
              d="M34 3C37.3137 3 40 5.68629 40 9V28.4766C40 31.7903 37.3137 34.4766 34 34.4766H26.0576L23.8662 37.0996L21.335 34.4766H13C9.68629 34.4766 7 31.7903 7 28.4766V9C7 5.68629 9.68629 3 13 3H34Z" 
              fill="white"
            />
          </mask>
        </defs>

        <g filter="url(#filter0_d_309_804)">
          <path 
            d="M34 3C37.3137 3 40 5.68629 40 9V28.4766C40 31.7903 37.3137 34.4766 34 34.4766H26.0576L23.8662 37.0996L21.335 34.4766H13C9.68629 34.4766 7 31.7903 7 28.4766V9C7 5.68629 9.68629 3 13 3H34Z" 
            fill="#D9D9D9"
          />
          
          <g mask="url(#catMask)">
            {photoUrl && (
              <image 
                href={photoUrl} 
                x="7" 
                y="3" 
                width="33" 
                height="32" 
                preserveAspectRatio="xMidYMid slice" 
              />
            )}
          </g>

          <path 
            d="M13 4H34C36.7614 4 39 6.23858 39 9V28.4766C39 31.238 36.7614 33.4766 34 33.4766H25.5898L25.29 33.835L23.8115 35.6035L22.0547 33.7822L21.7598 33.4766H13C10.2386 33.4766 8 31.238 8 28.4766V9C8 6.32472 10.1011 4.14053 12.7432 4.00684L13 4Z" 
            stroke={strokeColor} 
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}