import Image from "next/image";

export default function UserProfile({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    return (
      <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-white/20">
        <Image src="/user-avatar.jpg" alt="User" width={48} height={48} />
      </div>
    );
  }

  return (
    <button className="w-[48px] h-[48px] flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.4"/>
        <path d="M24 24c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white" />
      </svg>
    </button>
  );
}