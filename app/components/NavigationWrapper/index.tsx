"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import NavigationBar from "../NavigationBar";
import Sidebar from "../Sidebar";

export default function NavigationWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("id", userId)
      .single();
    setAvatarUrl(data?.avatar_url || null);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      if (loggedIn && session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <NavigationBar
        isLoggedIn={isLoggedIn}
        avatarUrl={avatarUrl}
        isMenuOpen={isSidebarOpen}
        onMenuClick={() => setIsSidebarOpen((open) => !open)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
