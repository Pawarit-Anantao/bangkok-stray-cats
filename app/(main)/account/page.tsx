"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DefaultPersonIcon = ({ size = 60 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [unlockedAvatars, setUnlockedAvatars] = useState<any[]>([]);

  const [newPlatform, setNewPlatform] = useState("line");
  const [newHandle, setNewHandle] = useState("");

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (profile) {
        setUser(profile);
        setUsername(profile.username || "");
      }

      const { data: contactData } = await supabase
        .from("user_contacts")
        .select("*")
        .eq("user_id", session.user.id);
      setContacts(contactData || []);

      const { data: unlocked } = await supabase
        .from("user_unlocked_avatars")
        .select(`avatar_master (*)`)
        .eq("user_id", session.user.id);
      setUnlockedAvatars(
        unlocked?.map((item: any) => item.avatar_master) || [],
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (url: string) => {
    const { error } = await supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", user.id);
    if (!error) {
      setUser({ ...user, avatar_url: url });
      alert("เปลี่ยนรูปโปรไฟล์สำเร็จ!");
    }
  };

  const handleUpdateName = async () => {
    const { error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user.id);
    if (!error) alert("อัปเดตชื่อสำเร็จ!");
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) return;
    const { data, error } = await supabase
      .from("user_contacts")
      .insert({
        user_id: user.id,
        platform: newPlatform,
        handle: newHandle,
        is_public: true,
      })
      .select()
      .single();

    if (!error) {
      setContacts([...contacts, data]);
      setNewHandle("");
    }
  };

  const deleteContact = async (id: string) => {
    await supabase.from("user_contacts").delete().eq("id", id);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  if (loading) return <div style={loadingStyle}>กำลังโหลดข้อมูล...</div>;

  return (
    <main style={mainLayout}>
      <header style={headerStyle}>
        <button onClick={() => router.back()} style={backBtn}>
          ←
        </button>
        <h1 style={titleStyle}>บัญชีของคุณ</h1>
      </header>

      <section style={contentSection}>
        <div style={avatarCenterSection}>
          <div style={avatarCircle}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} style={avatarImg} alt="Profile" />
            ) : (
              <div style={defaultIconWrapper}>
                <DefaultPersonIcon size={50} />
              </div>
            )}
          </div>
          <div style={userEmailText}>{user?.email}</div>
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>ชื่อผู้ใช้ (Username)</label>
          <div style={inputRow}>
            <input
              style={textInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ระบุชื่อใหม่..."
            />
            <button style={blackBtn} onClick={handleUpdateName}>
              บันทึก
            </button>
          </div>
        </div>

        <div style={divider} />

        <div style={formGroup}>
          <label style={labelStyle}>ข้อมูลติดต่อของคุณ</label>
          <div style={contactList}>
            {contacts.map((c) => (
              <div key={c.id} style={contactItem}>
                <span style={platformTag}>{c.platform.toUpperCase()}</span>
                <span style={handleText}>{c.handle}</span>
                <button style={delBtn} onClick={() => deleteContact(c.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddContact} style={addContactForm}>
            <select
              style={selectInput}
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
            >
              <option value="line">Line</option>
              <option value="facebook">Facebook</option>
              <option value="phone">Phone</option>
            </select>
            <input
              style={textInputSmall}
              placeholder="ไอดี/เบอร์โทร..."
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
            />
            <button type="submit" style={whiteBtn}>
              เพิ่ม
            </button>
          </form>
        </div>

        <div style={divider} />

        <div style={formGroup}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={labelStyle}>คอลเลกชันโปรไฟล์ที่ปลดล็อก</label>
            <span style={{ fontSize: "11px", color: "#AAA" }}>
              แตะเพื่อเปลี่ยนรูป
            </span>
          </div>

          {unlockedAvatars.length > 0 ? (
            <div style={avatarGrid}>
              {unlockedAvatars.map((ava) => (
                <div
                  key={ava.id}
                  style={{
                    ...gridItem,
                    border:
                      user?.avatar_url === ava.url
                        ? "2px solid #000"
                        : "1px solid #EEE",
                  }}
                  onClick={() => handleUpdateAvatar(ava.url)}
                >
                  <img src={ava.url} style={gridImg} alt={ava.name_th} />
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyGallery}>ยังไม่มีรูปในคอลเลกชัน</div>
          )}
        </div>
      </section>
    </main>
  );
}

const FONT_VAR = "var(--font-noto-looped)";
const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  background: "#FFF",
  padding: "24px 20px 60px 20px",
  fontFamily: FONT_VAR,
};
const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
};
const titleStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 400,
  margin: 0,
  color: "#000",
};
const backBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#000",
};
const contentSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  maxWidth: "350px",
  margin: "0 auto",
  width: "100%",
};

const avatarCenterSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};
const avatarCircle: React.CSSProperties = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  border: "1.5px solid #000",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const avatarImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const defaultIconWrapper: React.CSSProperties = { color: "#CCC" };
const userEmailText: React.CSSProperties = { fontSize: "13px", color: "#888" };

const avatarGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginTop: "10px",
};
const gridItem: React.CSSProperties = {
  aspectRatio: "1/1",
  borderRadius: "12px",
  overflow: "hidden",
  cursor: "pointer",
  background: "#F9F9F9",
};
const gridImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const emptyGallery: React.CSSProperties = {
  padding: "20px",
  border: "1px dashed #DDD",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: "12px",
  color: "#AAA",
};

const formGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 400,
  color: "#000",
};
const inputRow: React.CSSProperties = { display: "flex", gap: "8px" };
const textInput: React.CSSProperties = {
  flex: 1,
  height: "40px",
  padding: "0 15px",
  borderRadius: "12px",
  border: "1.5px solid #000",
  outline: "none",
  fontSize: "14px",
};
const blackBtn: React.CSSProperties = {
  background: "#000",
  color: "#FFF",
  border: "none",
  padding: "0 20px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
};
const whiteBtn: React.CSSProperties = {
  background: "#FFF",
  color: "#000",
  border: "1.5px solid #000",
  padding: "0 15px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
};
const divider: React.CSSProperties = { height: "1px", background: "#EEE" };

const contactList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};
const contactItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#F9F9F9",
  padding: "8px 12px",
  borderRadius: "10px",
};
const platformTag: React.CSSProperties = {
  fontSize: "9px",
  background: "#000",
  color: "#FFF",
  padding: "2px 6px",
  borderRadius: "4px",
};
const handleText: React.CSSProperties = { flex: 1, fontSize: "13px" };
const delBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#FF146E",
  cursor: "pointer",
};

const addContactForm: React.CSSProperties = { display: "flex", gap: "8px" };
const selectInput: React.CSSProperties = {
  height: "36px",
  border: "1.5px solid #000",
  borderRadius: "10px",
  fontSize: "12px",
  padding: "0 5px",
};
const textInputSmall: React.CSSProperties = {
  ...textInput,
  height: "36px",
  fontSize: "13px",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  color: "#000",
  fontFamily: FONT_VAR,
};
