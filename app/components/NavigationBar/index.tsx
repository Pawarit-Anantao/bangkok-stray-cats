"use client";

import Image from "next/image";
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";

interface NavigationBarProps {
  isLoggedIn?: boolean;
  isMenuOpen?: boolean;
  onMenuClick?: () => void;
}

export default function NavigationBar({ 
  isLoggedIn = false, 
  isMenuOpen = false,
  onMenuClick 
}: NavigationBarProps) {
  return (
    <nav 
      className="flex flex-col flex-none shrink-0 items-center w-full z-50 bg-[#5180CE] shadow-[0_2px_5.4px_0_rgba(0,0,0,0.79)] h-[64px] min-h-[64px] max-h-[74px] overflow-hidden"
      style={{
        paddingTop: "30px",
        paddingBottom: "2px"
      }}
    >
      <div className="flex items-center justify-between w-[86%] max-w-[335px] mx-auto">
        <MenuButton onClick={onMenuClick} isOpen={isMenuOpen} />
        <div className="flex shrink-0 w-[102px] h-[54px]">
          <Image 
            src="/logo.svg" 
            alt="BKK Stray Cats Logo"
            width={102}
            height={54}
            className="object-contain"
          />
        </div>

        <UserProfile isLoggedIn={isLoggedIn} />

      </div>
    </nav>
  );
}