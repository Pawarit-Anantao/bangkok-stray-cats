"use client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  "บทความ",
  "แมวของคุณ",
  "แมวที่บันทึกไว้",
  "บัญชีของคุณ",
  "ออกจากระบบ",
] as const;

const MENU_ROW_CLASS =
  "flex items-center w-full pb-2 border-b border-white text-white bg-transparent cursor-pointer transition-colors hover:bg-white/10 hover:text-[#FF146E] hover:border-[#FF146E] active:bg-white/20 active:text-[#FF146E] active:border-[#FF146E]";

const LABEL_CLASS =
  "flex-1 text-inherit text-[14px] font-normal leading-normal whitespace-nowrap overflow-hidden text-ellipsis";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
            <div key={item} className={MENU_ROW_CLASS}>
              <span className={LABEL_CLASS}>{item}</span>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
