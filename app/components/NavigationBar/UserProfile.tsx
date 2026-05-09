import Image from "next/image";

export default function UserProfile({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-[8px] w-[48px] h-[48px] shrink-0 rounded-full overflow-hidden border-2 border-white/20">
        <Image src="/user-avatar.jpg" alt="User" width={48} height={48} className="object-cover" />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex items-center justify-center w-[48px] h-[48px] shrink-0 rounded-full bg-transparent border-none outline-none transition-colors hover:bg-white/10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.4" />
      </svg>
    </button>
  );
}
