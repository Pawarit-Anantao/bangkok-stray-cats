// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",           // 👈 ต้องมีบรรทัดนี้เพื่อส่องดูทุกอย่างใน app
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",    // 👈 บรรทัดนี้จะส่องดูถ้ามีโฟลเดอร์ components นอก app
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cat-blue': '#5180CE',      // ฟ้าหลัก
        'cat-pink': '#FF146E',      // ชมพู
        'cat-bg': '#FFFAF0',        // พื้นหลัง
        'cat-border': '#D2CCBB',    // สีกรอบ
        'cat-fill': '#F7F7F7',      // สี fill
        'cat-subtitle': '#8F8362',  // สีหัวข้อรอง
        'cat-text': '#000000',      // สีตัวอักษร
      },
      fontFamily: {
        'noto-looped': ['"Noto Sans Thai Looped"', 'sans-serif'],
        bebas: ["var(--font-bebas)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;