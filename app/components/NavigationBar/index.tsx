"use client";

import Image from "next/image";
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";

interface NavigationBarProps {
  isLoggedIn?: boolean;
  onMenuClick?: () => void;
}

export default function NavigationBar({ 
  isLoggedIn = false, 
  onMenuClick 
}: NavigationBarProps) {
  return (
    <nav className="flex flex-col items-center w-full z-50 shrink-0"
      style={{
        minHeight: "97px",
        padding: "34px 0px 9px 0px",
        background: "#5180CE",
        boxShadow: "0px 2px 5.4px 0px rgba(0, 0, 0, 0.79)"
      }}
    >
      <div className="flex items-center justify-between w-full px-6">
        <MenuButton onClick={onMenuClick} />
        
        <div className="flex shrink-0 items-center justify-center w-[102px] h-[54px]">
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