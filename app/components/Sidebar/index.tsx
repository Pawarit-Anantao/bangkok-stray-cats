"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✨ กำหนดเมนูพร้อมเส้นทาง
const MENU_ITEMS = [
  { label: "หน้าแรก", path: "/" },
  { label: "บทความ", path: "/articles" },
  { label: "แมวของคุณ", path: "/my-cats" },
  { label: "แมวที่บันทึกไว้", path: "/bookmarks" },
  { label: "บัญชีของคุณ", path: "/account" },
] as const;

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose(); // ปิด Sidebar หลังกดเมนู
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("เกิดข้อผิดพลาดในการออกจากระบบ: " + error.message);
    } else {
      localStorage.removeItem("guest_mode");
      router.refresh(); // รีเฟรชสถานะหน้าเว็บ
      router.push("/login");
      onClose();
    }
  };

  const overlayClasses = [
    "absolute inset-0 bg-black/50 z-40 transition-opacity duration-300",
    isOpen ? "opacity-100 visible" : "opacity-0 invisible",
  ].join(" ");

  const panelClasses = [
    "absolute top-0 left-0 h-full w-[180px] bg-[#5180CE] z-40 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden",
    isOpen ? "translate-x-0" : "-translate-x-full",
  ].join(" ");

  return (
    <>
      <div onClick={onClose} aria-hidden={!isOpen} className={overlayClasses} />

      <aside
        className={panelClasses}
        aria-hidden={!isOpen}
        style={{ paddingTop: 128, paddingLeft: 12, paddingRight: 12 }}
      >
        <nav className="flex flex-col gap-[20px] w-full mt-2">
          {MENU_ITEMS.map((item) => (
            <div 
              key={item.label} 
              className={MENU_ROW_CLASS}
              onClick={() => handleNavigation(item.path)}
            >
              <span className={LABEL_CLASS}>{item.label}</span>
            </div>
          ))}

          {/* ✨ แยกปุ่มออกจากระบบมาจัดการฟังก์ชันพิเศษ */}
          <div 
            className={MENU_ROW_CLASS} 
            onClick={handleLogout}
            style={{ borderBottom: 'none', marginTop: '10px' }}
          >
            <span className={`${LABEL_CLASS} text-[#FF829E]`}>ออกจากระบบ</span>
          </div>
        </nav>
      </aside>
    </>
  );
}

// --- Styles (คงเดิมจากไฟล์ที่คุณส่งมา) ---
const MENU_ROW_CLASS =
  "flex items-center w-full pb-2 border-b border-white text-white bg-transparent cursor-pointer transition-colors hover:bg-white/10 hover:text-[#FF146E] hover:border-[#FF146E] active:bg-white/20 active:text-[#FF146E] active:border-[#FF146E]";

const LABEL_CLASS =
  "flex-1 text-inherit text-[14px] font-normal leading-normal whitespace-nowrap overflow-hidden text-ellipsis";