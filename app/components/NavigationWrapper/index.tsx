"use client";

import { useState } from "react";
import NavigationBar from "../NavigationBar";
import Sidebar from "../Sidebar";

export default function NavigationWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <NavigationBar
        isLoggedIn={false}
        isMenuOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
