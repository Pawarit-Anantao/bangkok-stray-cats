"use client";

import NavigationWrapper from "../components/NavigationWrapper";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-[#F5F0E6] flex flex-col overflow-hidden">
      <NavigationWrapper />
      

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}