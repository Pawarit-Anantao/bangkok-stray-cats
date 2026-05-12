"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import CatCard from "@/components/CatCard";
import SearchBar from "@/components/SearchBar";

export default function BookmarksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookmarkedCats, setBookmarkedCats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("cat_bookmarks")
          .select(
            `
            cats (*)
          `,
          )
          .eq("user_id", session.user.id)
          .is("cats.deleted_at", null);

        if (error) throw error;

        const cats = data?.map((item: any) => item.cats).filter(Boolean) || [];
        setBookmarkedCats(cats);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [router]);

  const filteredCats = useMemo(() => {
    return bookmarkedCats.filter((cat) => {
      const query = searchQuery.toLowerCase();
      return (
        cat.name?.toLowerCase().includes(query) ||
        cat.address_name?.toLowerCase().includes(query)
      );
    });
  }, [bookmarkedCats, searchQuery]);

  if (loading)
    return <div style={loadingStyle}>กำลังโหลดแมวที่คุณบันทึกไว้...</div>;

  return (
    <main style={mainLayout}>
      {/* --- Header --- */}
      <header style={headerStyle}>
        <button onClick={() => router.back()} style={backBtnStyle}>
          ←
        </button>
        <h1 style={titleStyle}>แมวที่บันทึกไว้</h1>
      </header>

      <div style={searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="ค้นหาชื่อหรือเขต..."
          selectedTags={[]}
          onRemoveTag={() => {}}
          onOpenFilter={() => {}}
        />
      </div>

      <section style={contentWrapper}>
        <div style={sectionContainer}>
          <h2 style={sectionHeaderStyle}>
            รายการทั้งหมด ({filteredCats.length})
          </h2>

          {filteredCats.length > 0 ? (
            <div style={catGridWrapper}>
              {filteredCats.map((cat) => (
                <CatCard
                  key={cat.id}
                  catId={cat.id}
                  onClick={(id) => router.push(`/cat/${id}`)}
                  onBookmarkClick={() => {
                    setBookmarkedCats((prev) =>
                      prev.filter((c) => c.id !== cat.id),
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={emptyBox}>
              {searchQuery
                ? "ไม่พบแมวที่ตรงกับการค้นหา"
                : "คุณยังไม่มีแมวที่บันทึกไว้เลย"}
            </div>
          )}
        </div>

        {bookmarkedCats.length === 0 && !loading && (
          <div style={noDataFull}>
            <button onClick={() => router.push("/")} style={primaryBtn}>
              ไปส่องน้องแมวบนแผนที่
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

const FONT_VAR = "var(--font-noto-looped)";

const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  background: "#F5F0E6",
  padding: "24px 20px 80px 20px",
  fontFamily: FONT_VAR,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
};
const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 400,
  margin: 0,
};
const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: "26px",
  cursor: "pointer",
  padding: 0,
};

const searchWrapper: React.CSSProperties = { marginBottom: "24px" };
const contentWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
};
const sectionContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 400,
  margin: 0,
  color: "#333",
};

const catGridWrapper: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  width: "100%",
};

const emptyBox: React.CSSProperties = {
  width: "100%",
  padding: "24px 16px",
  border: "1.5px dashed #D2CCBB",
  borderRadius: "16px",
  textAlign: "center",
  color: "#8F8362",
  fontSize: "13px",
  boxSizing: "border-box",
};

const noDataFull: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "40px",
};
const primaryBtn: React.CSSProperties = {
  background: "#8F8362",
  color: "#FFF",
  border: "none",
  padding: "12px 30px",
  borderRadius: "24px",
  cursor: "pointer",
  fontSize: "14px",
};

const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  color: "#8F8362",
  fontFamily: FONT_VAR,
};
