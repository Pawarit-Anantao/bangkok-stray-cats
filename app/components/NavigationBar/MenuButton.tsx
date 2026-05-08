import { Menu } from "lucide-react";

export default function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex shrink-0 items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors w-[48px] h-[48px]"
    >
      <Menu size={32} />
    </button>
  );
}