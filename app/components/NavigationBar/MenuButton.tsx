type MenuButtonProps = {
  onClick?: () => void;
  isOpen?: boolean;
};

const STROKE_OPEN = "#FF146E" as const;
const STROKE_CLOSED = "white" as const;
const BAR_CLASS =
  "transition-colors duration-200 group-active:stroke-[#FF146E]";

export default function MenuButton({ onClick, isOpen = false }: MenuButtonProps) {
  const stroke = isOpen ? STROKE_OPEN : STROKE_CLOSED;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex shrink-0 items-center justify-center w-[48px] h-[48px] rounded-full bg-transparent border-none outline-none transition-all hover:bg-white/10 active:bg-white/20"
      aria-expanded={isOpen}
      aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" fill="none">
        <path d="M10 14H38" stroke={stroke} strokeWidth={2} strokeLinecap="round" className={BAR_CLASS} />
        <path d="M10 24H38" stroke={stroke} strokeWidth={2} strokeLinecap="round" className={BAR_CLASS} />
        <path d="M10 34H38" stroke={stroke} strokeWidth={2} strokeLinecap="round" className={BAR_CLASS} />
      </svg>
    </button>
  );
}
