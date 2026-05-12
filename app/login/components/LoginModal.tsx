"use client";

import React from "react";

interface LoginModalProps {
  isLogin: boolean;
  setIsLogin: (val: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  // ✨ เพิ่มช่อง Username
  username: string;
  setUsername: (val: string) => void;
  loading: boolean;
  onLogin: (e: React.FormEvent) => void;
  onSignUp: (e: React.FormEvent) => void;
  onGuest: () => void;
}

export default function LoginModal({
  isLogin, setIsLogin, email, setEmail,
  password, setPassword, 
  username, setUsername, // ✨
  loading,
  onLogin, onSignUp, onGuest
}: LoginModalProps) {
  return (
    <div className="fade-in" style={modalOverlayStyle} onClick={(e) => e.stopPropagation()}>
      <style jsx>{`
        .interactive-btn { transition: all 0.2s ease; cursor: pointer; }
        .interactive-btn:active { transform: scale(0.96); filter: brightness(1.2); }
        .interactive-input { transition: border 0.3s ease; }
        .interactive-input:focus-within { border-color: rgba(255, 255, 255, 0.8) !important; }
        .footer-link { cursor: pointer; transition: opacity 0.2s; }
        .footer-link:active { opacity: 0.6; transform: scale(0.98); }
        input:focus { outline: none !important; }
      `}</style>

      <div style={cardFrame}>
        <div style={innerContentFrame}>
          
          <div style={headerFrame}>
            <div style={titleStack}>
              <div style={bebasTitle}>BANGKOK’S</div>
              <div style={bebasTitleLower}>street cats</div>
            </div>
            <div style={thaiSubtitle}>แผนที่แมวจรจัด กรุงเทพฯ</div>
          </div>

          <form onSubmit={isLogin ? onLogin : onSignUp} style={formFrame}>
            {/* ✨ เพิ่มฟิลด์ Username เฉพาะตอนสมัครสมาชิก */}
            {!isLogin && (
              <div style={inputGroupFrame}>
                <label style={labelStyle}>ชื่อผู้ใช้ (Username)</label>
                <div className="interactive-input" style={inputBox}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={rawInput}
                    required={!isLogin}
                    placeholder="เช่น CatLover99"
                  />
                </div>
              </div>
            )}

            <div style={inputGroupFrame}>
              <label style={labelStyle}>อีเมล (Email)</label>
              <div className="interactive-input" style={inputBox}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={rawInput}
                  required
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#90A0B9"/>
                  <path d="M5.33788 17.3206C5.99897 14.5269 8.77173 13 11.6426 13H12.3574C15.2283 13 18.001 14.5269 18.6621 17.3206C18.79 17.8611 18.8917 18.4268 18.9489 19.0016C19.0036 19.5512 18.5523 20 18 20H6C5.44772 20 4.99642 19.5512 5.0511 19.0016C5.1083 18.4268 5.20997 17.8611 5.33788 17.3206Z" fill="#90A0B9"/>
                </svg>
              </div>
            </div>

            <div style={inputGroupFrame}>
              <label style={labelStyle}>รหัสผ่าน (Password)</label>
              <div className="interactive-input" style={inputBox}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={rawInput}
                  required
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="15" r="3" fill="#90A0B9" stroke="#90A0B9" strokeWidth="2"/>
                  <path d="M18.2071 6.20711C18.5976 5.81658 18.5976 5.18342 18.2071 4.79289C17.8166 4.40237 17.1834 4.40237 16.7929 4.79289L17.5 5.5L18.2071 6.20711ZM18.2929 9.70711L19 10.4142L20.4142 9L19.7071 8.29289L19 9L18.2929 9.70711ZM16.2929 9.70711L17 10.4142L18.4142 9L17.7071 8.29289L17 9L16.2929 9.70711ZM9.29289 12.2929C8.90237 12.6834 8.90237 13.3166 9.29289 13.7071C9.68342 14.0976 10.3166 14.0976 10.7071 13.7071L10 13L9.29289 12.2929ZM15.7929 11.2071L16.5 11.9142L17.9142 10.5L17.2071 9.79289L16.5 10.5L15.7929 11.2071ZM16.5 6.5L17.2071 7.20711L18.2071 6.20711L17.5 5.5L16.7929 4.79289L15.7929 5.79289L16.5 6.5ZM16.5 6.5L15.7929 7.20711L18.2929 9.70711L19 9L19.7071 8.29289L17.2071 5.79289L16.5 6.5ZM15.5 7.5L16.2071 8.20711L17.2071 7.20711L16.5 6.5L15.7929 5.79289L14.7929 6.79289L15.5 7.5ZM15.5 7.5L14.7929 8.20711L16.2929 9.70711L17 9L17.7071 8.29289L16.2071 6.79289L15.5 7.5ZM10 13L10.7071 13.7071L15.2071 9.20711L14.5 8.5L13.7929 7.79289L9.29289 12.2929L10 13ZM14.5 8.5L15.2071 9.20711L16.2071 8.20711L15.5 7.5L14.7929 6.79289L13.7929 7.79289L14.5 8.5ZM14.5 8.5L13.7929 9.20711L15.7929 11.2071L16.5 10.5L17.2071 9.79289L15.2071 7.79289L14.5 8.5Z" fill="#90A0B9"/>
                </svg>
              </div>
            </div>

            <div style={buttonGroupFrame}>
              <button className="interactive-btn" type="submit" style={loginBtn} disabled={loading}>
                <span style={loginText}>
                  {loading ? "กำลังประมวลผล..." : isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                </span>
              </button>

              <div style={dividerWrapper}>
                <div style={dividerLine}></div>
                <div style={dividerText}>หรือ</div>
                <div style={dividerLine}></div>
              </div>

              <button className="interactive-btn" type="button" onClick={onGuest} style={guestBtn}>
                <span style={guestText}>เข้าใช้งานในฐานะผู้เยี่ยมชม</span>
              </button>

              <div style={footerFrame}>
                <span style={footerBlackText}>
                  {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
                </span>
                <span className="footer-link" style={footerWhiteText} onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "สมัครสมาชิกที่นี่" : "เข้าสู่ระบบที่นี่"}
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Styles (คงเดิม) ---
const modalOverlayStyle: React.CSSProperties = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, backgroundColor: "rgba(0, 0, 0, 0.05)" };
const cardFrame: React.CSSProperties = { display: "flex", width: "300px", minHeight: "450px", padding: "22px", flexDirection: "column", alignItems: "center", borderRadius: "16px", border: "0.5px solid rgba(255, 255, 255, 0.4)", background: "rgba(13, 48, 103, 0.5)", backdropFilter: "blur(16px)" };
const innerContentFrame: React.CSSProperties = { display: "flex", width: "100%", flexDirection: "column", alignItems: "center" };
const headerFrame: React.CSSProperties = { display: "flex", width: "100%", flexDirection: "column", alignItems: "center", marginBottom: "5px" };
const titleStack: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "flex-start", width: "fit-content" };
const bebasTitle: React.CSSProperties = { color: "#000", fontFamily: "var(--font-bebas)", fontSize: "42px", lineHeight: "0.85", textShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" };
const bebasTitleLower: React.CSSProperties = { ...bebasTitle, marginTop: "5px" };
const thaiSubtitle: React.CSSProperties = { alignSelf: "stretch", color: "#FFF", fontFamily: "var(--font-noto-looped)", fontSize: "12px", fontWeight: 300, textAlign: "center", marginTop: "-6px" };
const formFrame: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch", marginTop: "10px" };
const inputGroupFrame: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "3px", alignSelf: "stretch" };
const labelStyle: React.CSSProperties = { color: "#FFF", fontFamily: "var(--font-noto-looped)", fontSize: "12px", fontWeight: 300 };
const inputBox: React.CSSProperties = { display: "flex", height: "38px", padding: "0 10px", alignItems: "center", justifyContent: "space-between", borderRadius: "8px", border: "0.7px solid rgba(255, 255, 255, 0.3)", background: "rgba(0, 0, 0, 0.25)" };
const rawInput: React.CSSProperties = { flex: 1, background: "none", border: "none", outline: "none", color: "#FFF", fontSize: "12px", fontWeight: 300 };
const buttonGroupFrame: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "10px", alignSelf: "stretch", marginTop: "20px" };
const loginBtn: React.CSSProperties = { display: "flex", height: "38px", justifyContent: "center", alignItems: "center", borderRadius: "99px", background: "#000", border: "none" };
const loginText: React.CSSProperties = { color: "#FFF", fontFamily: "var(--font-noto-looped)", fontSize: "12px", fontWeight: 300 };
const dividerWrapper: React.CSSProperties = { display: "flex", alignItems: "center", gap: '8px' };
const dividerLine: React.CSSProperties = { flex: 1, height: "1px", background: "rgba(205, 219, 243, 0.25)" };
const dividerText: React.CSSProperties = { color: "#CDDBF3", fontSize: "10px", fontWeight: 300 };
const guestBtn: React.CSSProperties = { display: "flex", height: "38px", justifyContent: "center", alignItems: "center", borderRadius: "99px", background: "#FFF", border: "none" };
const guestText: React.CSSProperties = { color: "#000", fontSize: "12px", fontWeight: 400 };
const footerFrame: React.CSSProperties = { display: "flex", gap: "6px", justifyContent: "center" };
const footerBlackText: React.CSSProperties = { color: "#000", fontSize: "11px", fontWeight: 300 };
const footerWhiteText: React.CSSProperties = { color: "#FFF", fontSize: "11px", fontWeight: 300, textDecoration: "underline" };