"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

import MapToggle from "../components/MapToggle";
import AddButton from "../components/Map/components/AddButton";
import MapHandle from "../components/MapHandle";
import SearchBar from "../components/SearchBar";
import CatCard from "../components/CatCard";
import TagSelectionWindow from "../components/TagSelectionWindow";

const MAP_HEIGHTS = ["60dvh", "20dvh", "2px"];
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังโหลดแผนที่...</div>,
});

export default function Home() {
  const router = useRouter();
  const [mapMode, setMapMode] = useState<"official" | "community">("community");
  const [mapState, setMapState] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGuestUser, setIsGuestUser] = useState(false);

  const [allCats, setAllCats] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isGuest = localStorage.getItem("guest_mode");
      setIsGuestUser(!!isGuest);

      if (!session && !isGuest) {
        router.push("/login");
      } else {
        fetchInitialData();
      }
    };
    checkAccess();
  }, [router]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const { data: cats, error: catError } = await supabase
        .from("cats")
        .select("*")
        .order("created_at", { ascending: false });

      if (catError) throw catError;
      setAllCats(cats || []);

      const { data: tags, error: tagError } = await supabase
        .from("cat_tags")
        .select("*")
        .eq("is_active", true);

      if (tagError) throw tagError;
      setAllTags(tags || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCats = useMemo(() => {
    return allCats.filter((cat) => {
      const query = searchQuery.toLowerCase();

      const matchText =
        cat.name?.toLowerCase().includes(query) ||
        cat.address_name?.toLowerCase().includes(query) ||
        cat.address_detail?.toLowerCase().includes(query);

      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every(
          (t) =>
            [
              cat.pattern,
              cat.color,
              cat.gender,
              cat.fur_length,
              cat.size,
            ].includes(t.key) ||
            cat.last_health_tags?.split(",").includes(t.key),
        );

      return matchText && matchTags;
    });
  }, [allCats, searchQuery, selectedTags]);

  const paginatedCats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCats.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCats, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCats.length / itemsPerPage);

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);
  const handleToggle = () => setMapState((prev) => (prev + 1) % 3);

  const handleToggleTag = (tag: any) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.key === tag.key)
        ? prev.filter((t) => t.key !== tag.key)
        : [...prev, tag],
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTags]);

  return (
    <main style={mainLayout}>
      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map showMarkers={true} mode={mapMode} />

        {mapState === 0 && (
          <div style={overlayContainer}>
            <div style={togglePos}>
              <MapToggle mode={mapMode} onChange={setMapMode} />
            </div>
            {!isGuestUser && <AddButton onClick={() => router.push("/add")} />}
          </div>
        )}
        <MapHandle state={mapState} onClick={handleToggle} />
      </section>

      <section style={contentWrapper}>
        <div style={searchContainer}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedTags={selectedTags}
            onRemoveTag={(key) =>
              setSelectedTags((prev) => prev.filter((t) => t.key !== key))
            }
            onOpenFilter={() => setIsFilterOpen(true)}
          />
        </div>

        {loading ? (
          <div style={statusTextStyle}>กำลังเรียกน้องแมว...</div>
        ) : (
          <div id="scroll-root" style={scrollArea}>
            {paginatedCats.length > 0 ? (
              <>
                <div style={catGridWrapper}>
                  {paginatedCats.map((cat) => (
                    <CatCard
                      key={cat.id}
                      catId={cat.id}
                      onClick={(id) => router.push(`/cat/${id}`)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={paginationNav}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      style={pageBtn}
                    >
                      ย้อนกลับ
                    </button>
                    <span style={pageInfo}>
                      หน้า {currentPage} จาก {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      style={pageBtn}
                    >
                      ถัดไป
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={statusTextStyle}>
                {!searchQuery && selectedTags.length === 0
                  ? "ไม่พบข้อมูลแมวในระบบ"
                  : "ไม่พบแมวที่ตรงกับเงื่อนไขการค้นหา"}
              </div>
            )}
          </div>
        )}
      </section>

      {isFilterOpen && (
        <TagSelectionWindow
          categoryLabel="เลือกแท็กลักษณะแมว"
          tags={allTags}
          selectedKeys={selectedTags.map((t) => t.key)}
          onToggle={(key) => {
            const tag = allTags.find((t) => t.key === key);
            if (tag) handleToggleTag(tag);
          }}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </main>
  );
}

const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100dvh",
  overflow: "hidden",
  backgroundColor: "#F5F0E6",
};
const mapWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
  transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 10,
  backgroundColor: "#E8E4D9",
  flexShrink: 0,
};
const overlayContainer: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  zIndex: 1000,
};
const togglePos: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  left: "16px",
  pointerEvents: "auto",
};

const contentWrapper: React.CSSProperties = {
  flex: 1,
  padding: "40px 0 0px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
};

const searchContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  padding: "0 10px 10px 10px",
  flexShrink: 0,
};
const scrollArea: React.CSSProperties = {
  flex: 1,
  width: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 15px",
};
const catGridWrapper: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 161px)",
  justifyContent: "center",
  gap: "12px",
  width: "100%",
  paddingBottom: "20px",
};
const paginationNav: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "20px 0 60px 0",
};
const pageBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #8F8362",
  background: "#FFF",
  color: "#8F8362",
  fontSize: "12px",
  cursor: "pointer",
};
const pageInfo: React.CSSProperties = {
  fontSize: "13px",
  color: "#8F8362",
  fontFamily: "var(--font-noto-looped)",
};
const statusTextStyle: React.CSSProperties = {
  marginTop: "30px",
  color: "#8F8362",
  fontSize: "14px",
  opacity: 0.6,
  fontFamily: "var(--font-noto-looped)",
};
const loadingStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
};
