"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

// Components
import Button from "@/components/Button";
import AttributeSection from "@/components/attributes";
import MapHandle from "@/components/MapHandle";
import LocationDisplay from "@/components/LocationDisplay";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังเตรียมแผนที่...</div>,
});

export default function ReportSightingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [mapState, setMapState] = useState(0);
  const [center, setCenter] = useState({ lat: 13.7649, lng: 100.5383 });
  const [addressData, setAddressData] = useState({ name: "", detail: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthTags, setHealthTags] = useState<any[]>([]);

  const [healthNote, setHealthInfo] = useState("");
  const [extraNote, setExtraInfo] = useState("");
  const [aggressiveness, setAggressiveness] = useState<string | null>(null);
  const [selectedHealthTags, setSelectedTags] = useState<{
    [key: string]: string[];
  }>({
    health: [],
  });

  useEffect(() => {
    const fetchInitial = async () => {
      const { data: catData } = await supabase
        .from("cats")
        .select("lat, lng")
        .eq("id", id)
        .single();
      if (catData) setCenter({ lat: catData.lat, lng: catData.lng });

      const { data: tags } = await supabase
        .from("cat_tags")
        .select("*")
        .eq("category", "health")
        .eq("is_active", true);
      if (tags) setHealthTags(tags);
    };
    fetchInitial();
  }, [id]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&accept-language=th`,
        );
        const data = await res.json();
        if (data && data.address) {
          const district =
            data.address.city ||
            data.address.suburb ||
            data.address.district ||
            "ไม่ระบุเขต";
          setAddressData({
            name: district,
            detail: data.display_name,
          });
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    };
    const timer = setTimeout(fetchAddress, 800);
    return () => clearTimeout(timer);
  }, [center]);

  const handleReport = async () => {
    try {
      setIsSubmitting(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบก่อนครับ");

      const score =
        aggressiveness === "very_friendly"
          ? 1
          : aggressiveness === "chill"
            ? 2
            : aggressiveness === "normal"
              ? 3
              : aggressiveness === "timid"
                ? 4
                : 5;

      const { data: sighting, error: sError } = await supabase
        .from("cat_sightings")
        .insert({
          cat_id: id,
          user_id: user.id,
          lat: center.lat,
          lng: center.lng,
          health_note: healthNote,
          note: extraNote,
          aggression_score: aggressiveness ? score : null,
          report_type: "sighting",
          address_name: addressData.name,
          address_detail: addressData.detail,
        })
        .select()
        .single();

      if (sError) throw sError;

      if (selectedHealthTags.health.length > 0) {
        const hEntries = selectedHealthTags.health.map((t) => ({
          sighting_id: sighting.id,
          tag_key: t,
        }));
        await supabase.from("sighting_health_tags").insert(hEntries);
      }

      await supabase
        .from("cats")
        .update({
          last_seen_at: new Date().toISOString(),
          last_health_note: healthNote,
          last_aggression_score: aggressiveness ? score : null,
          last_health_tags: selectedHealthTags.health.join(","),
          address_name: addressData.name,
          address_detail: addressData.detail,
          lat: center.lat,
          lng: center.lng,
        })
        .eq("id", id);

      alert("บันทึกประวัติการพบเห็นเรียบร้อยแล้วครับ! 🐾");
      router.push(`/cat/${id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAP_HEIGHTS = ["50dvh", "25dvh", "2px"];

  return (
    <main style={mainLayout}>
      <section style={{ ...mapWrapper, height: MAP_HEIGHTS[mapState] }}>
        <Map isPickerMode={true} onCenterChange={setCenter} />
        {mapState !== 2 && (
          <div style={flagContainerStyle}>
            <img
              src="/Flag.svg"
              alt="Flag"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        )}
        <MapHandle
          state={mapState}
          onClick={() => setMapState((p) => (p + 1) % 3)}
        />
        <button onClick={() => router.back()} style={backCircleBtn}>
          ✕
        </button>
      </section>

      <section style={contentWrapper}>
        <div style={innerForm}>
          <LocationDisplay lat={center.lat} lng={center.lng} />

          <div style={sectionSpacer}>
            <h2 style={sectionHeaderStyle}>บันทึกข้อมูลการพบเห็น</h2>
            <AttributeSection
              allTags={healthTags}
              selectedTags={selectedHealthTags}
              setSelectedTags={setSelectedTags as any}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              healthInfo={healthNote}
              setHealthInfo={setHealthInfo}
              extraInfo={extraNote}
              setExtraInfo={setExtraInfo}
              isSightingMode={true}
              catInfo=""
              setCatInfo={() => {}}
            />
          </div>

          <div style={btnGroup}>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              style={{ flex: 1 }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleReport}
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการพบ"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

const FONT_VAR = "var(--font-noto-looped)";

const mainLayout: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100dvh",
  background: "#F5F0E6",
  overflow: "hidden",
  fontFamily: FONT_VAR,
};
const mapWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
  transition: "height 0.4s ease",
};
const contentWrapper: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px",
};
const innerForm: React.CSSProperties = {
  maxWidth: "340px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const btnGroup: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  marginTop: "20px",
  paddingBottom: "40px",
};
const sectionSpacer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 400,
  color: "#000",
  margin: 0,
};
const flagContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -100%)",
  zIndex: 1001,
  pointerEvents: "none",
};
const backCircleBtn: React.CSSProperties = {
  position: "absolute",
  top: "15px",
  left: "15px",
  zIndex: 1002,
  background: "#FFF",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  border: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const loadingStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  color: "#8F8362",
};
