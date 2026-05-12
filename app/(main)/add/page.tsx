"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

import MapHandle from "@/components/MapHandle";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import LocationDisplay from "@/components/LocationDisplay";
import PhotoUploader from "./components/CatPhotoUploader";
import AttributeSection from "@/components/attributes";

const MAP_HEIGHTS = ["60dvh", "25dvh", "2px"];
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div style={loadingStyle}>กำลังเตรียมแผนที่...</div>,
});

export default function AddCatPage() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [mapState, setMapState] = useState(0);
  const [center, setCenter] = useState({ lat: 13.7649, lng: 100.5383 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [catName, setCatName] = useState("");
  const [catInfo, setCatInfo] = useState("");
  const [healthInfo, setHealthInfo] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [aggressiveness, setAggressiveness] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>(
    {
      pattern: [],
      color: [],
      fur_length: [],
      size: [],
      gender: [],
      health: [],
    },
  );
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);

  const currentHeight = useMemo(() => MAP_HEIGHTS[mapState], [mapState]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isGuest = localStorage.getItem("guest_mode");
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        if (!session) {
          if (!isGuest) router.replace("/login");
          else {
            alert("หน้านี้สำหรับสมาชิกเท่านั้นครับ");
            router.replace("/");
          }
        } else setIsChecking(false);
      }
      if (event === "SIGNED_OUT") router.replace("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase
        .from("cat_tags")
        .select("*")
        .eq("is_active", true);
      if (data) setAllTags(data);
    };
    fetchTags();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      const mapType = userData?.role === "admin" ? "official" : "community";

      const getFirstTag = (catKey: string) =>
        selectedTags[catKey]?.[0] || "unknown";

      const aggressionScore = aggressiveness
        ? aggressiveness === "very_friendly"
          ? 1
          : aggressiveness === "chill"
            ? 2
            : aggressiveness === "normal"
              ? 3
              : aggressiveness === "timid"
                ? 4
                : 5
        : null;

      const { data: newCat, error: catError } = await supabase
        .from("cats")
        .insert({
          name: catName || "น้องแมวไม่มีชื่อ",
          description: extraInfo,
          identifying_marks: catInfo,
          lat: center.lat,
          lng: center.lng,
          map_type: mapType,
          pattern: getFirstTag("pattern"),
          color: getFirstTag("color"),
          fur_length: getFirstTag("fur_length"),
          size: getFirstTag("size"),
          gender: getFirstTag("gender"),
          added_by: user.id,
          last_aggression_score: aggressionScore,
          last_health_note: healthInfo,
        })
        .select()
        .single();

      if (catError)
        throw new Error(`บันทึกข้อมูลแมวไม่สำเร็จ: ${catError.message}`);

      const { data: newSighting, error: sightingError } = await supabase
        .from("cat_sightings")
        .insert({
          cat_id: newCat.id,
          user_id: user.id,
          lat: center.lat,
          lng: center.lng,
          note: extraInfo,
          aggression_score: aggressionScore,
          health_note: healthInfo,
          identifying_note: catInfo,
          report_type: "sighting",
        })
        .select()
        .single();

      const healthTags = selectedTags["health"] || [];
      if (newSighting && healthTags.length > 0) {
        const healthEntries = healthTags.map((tagKey) => ({
          sighting_id: newSighting.id,
          tag_key: tagKey,
        }));
        await supabase.from("sighting_health_tags").insert(healthEntries);
      }

      if (uploadedPhotoUrls.length > 0) {
        const photoEntries = uploadedPhotoUrls.map((url, idx) => ({
          cat_id: newCat.id,
          public_url: url,
          storage_path: url.split("/").pop()?.split("?")[0],
          is_primary: idx === 0,
          uploaded_by: user.id,
        }));
        await supabase.from("cat_photos").insert(photoEntries);
      }

      alert(
        `บันทึกข้อมูลเรียบร้อยในโหมด ${mapType === "official" ? "เป็นทางการ" : "ชุมชน"}! `,
      );
      router.push("/");
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) return <div style={loadingStyle}>กำลังตรวจสอบสิทธิ์...</div>;

  return (
    <main style={mainLayout}>
      <style jsx global>{`
        input,
        textarea {
          min-height: 38px !important;
          height: auto !important;
          padding: 8px 12px !important;
          border-radius: 10px !important;
          font-size: 13px !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
        textarea {
          min-height: 60px !important;
        }
      `}</style>

      <section style={{ ...mapWrapper, height: currentHeight }}>
        <Map isPickerMode={true} onCenterChange={setCenter} />

        {mapState !== 2 && (
          <div style={centerPinContainer}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="#FF4D4D"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}

        <button onClick={() => router.push("/")} style={backCircleBtn}>
          ✕
        </button>
        <MapHandle
          state={mapState}
          onClick={() => setMapState((prev) => (prev + 1) % 3)}
        />
      </section>

      <section style={contentWrapper}>
        <div style={innerFormContainer}>
          <div className="form-field-wrapper" style={formFieldsWrapper}>
            <LocationDisplay lat={center.lat} lng={center.lng} />

            <PhotoUploader
              photoUrls={uploadedPhotoUrls}
              onUploadComplete={(urls) =>
                setUploadedPhotoUrls((prev) => [...prev, ...urls])
              }
              onRemovePhoto={(index) => {
                setUploadedPhotoUrls((prev) =>
                  prev.filter((_, i) => i !== index),
                );
              }}
            />

            <FormField label="ชื่อน้องแมว (ถ้ามี)">
              <input
                type="text"
                placeholder="ระบุชื่อน้องแมว..."
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                style={slimInputStyle}
              />
            </FormField>

            <AttributeSection
              allTags={allTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              catInfo={catInfo}
              setCatInfo={setCatInfo}
              healthInfo={healthInfo}
              setHealthInfo={setHealthInfo}
              extraInfo={extraInfo}
              setExtraInfo={setExtraInfo}
            />
          </div>

          <div style={buttonGroupContainer}>
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              style={{ flex: 1, height: "40px" }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ flex: 1, height: "40px" }}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

const centerPinContainer: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -100%)",
  zIndex: 1001,
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const slimInputStyle: React.CSSProperties = {
  background: "#FFF",
  border: "1.5px solid #D2CCBB",
  outline: "none",
};
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
  flexShrink: 0,
};
const contentWrapper: React.CSSProperties = {
  flex: 1,
  padding: "20px 20px 24px 20px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const innerFormContainer: React.CSSProperties = {
  width: "100%",
  maxWidth: "334px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const formFieldsWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "100%",
};
const buttonGroupContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "15px",
  marginTop: "25px",
  width: "100%",
  paddingBottom: "30px",
};
const backCircleBtn: React.CSSProperties = {
  position: "absolute",
  top: "15px",
  left: "15px",
  zIndex: 1002,
  background: "#FFF",
  border: "none",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const loadingStyle: React.CSSProperties = {
  width: "100%",
  height: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  backgroundColor: "#F5F0E6",
};
