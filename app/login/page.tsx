"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LoginModal from "./components/LoginModal";

export default function LoginPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ✨ เพิ่ม State Username
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
    } else {
      localStorage.removeItem("guest_mode");
      router.push("/");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✨ แก้ไขจุดขัดแย้ง: ส่ง username ไปเก็บใน metadata ของ Auth User
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username }, // Metadata ตัวนี้จะถูก Trigger นำไปเก็บใน public.users
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert(
        "สมัครสมาชิกสำเร็จ! ตรวจสอบอีเมลเพื่อยืนยัน แล้วลองเข้าสู่ระบบนะครับ",
      );
      setIsLogin(true);
    }
    setLoading(false);
  };

  const handleGuest = () => {
    localStorage.setItem("guest_mode", "true");
    router.push("/");
  };

  return (
    <main style={containerStyle} onClick={() => !isActive && setIsActive(true)}>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        .fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .blink-slow {
          animation: blink 3s ease-in-out infinite;
        }
      `}</style>

      <div style={logoWrapperStyle}>
        <img src="/logo.svg" alt="Logo" style={logoStyle} />
      </div>

      <div style={cloudWrapperStyle}>
        <img src="/cloud.svg" alt="Cloud" style={cloudStyle} />
      </div>

      {isActive && (
        <LoginModal
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          username={username} // ✨
          setUsername={setUsername} // ✨
          loading={loading}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onGuest={handleGuest}
        />
      )}

      {!isActive && (
        <div className="blink-slow" style={instructionStyle}>
          กดตรงไหนก็ได้เพื่อเริ่ม
        </div>
      )}
    </main>
  );
}

// --- Styles (คงเดิม) ---
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100dvh",
  backgroundColor: "#5180CE",
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
};
const logoWrapperStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(12% - 100px)",
  textAlign: "center",
  zIndex: 5,
};
const logoStyle: React.CSSProperties = { width: "320px", height: "auto" };
const cloudWrapperStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "-15%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "180%",
  zIndex: 1,
  pointerEvents: "none",
};
const cloudStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  opacity: 1,
};
const instructionStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "80px",
  color: "#10223E",
  fontSize: "14px",
  fontWeight: "400",
  zIndex: 10,
  letterSpacing: "0.5px",
};
