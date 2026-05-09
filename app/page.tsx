import SightingInfoBox, { type CatLocationData } from "./components/SightingInfoBox";

const PLACEHOLDER_SIGHTING: CatLocationData = {
  id: "demo-1",
  district: "ราชเทวี",
  fullAddress: "ถนนเพชรบุรี, แขวงมักกะสัน เขตราชเทวี",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full flex-1">
      <div className="w-full h-[300px] bg-[#F5F0E6] border-b-2 border-black flex items-center justify-center">
        <span className="text-gray-500 font-bold">[ พื้นที่แผนที่ ]</span>
      </div>

      <div className="w-full flex flex-col p-4 bg-[#F5F0E6]">
        <SightingInfoBox sightingData={PLACEHOLDER_SIGHTING} />
      </div>
    </div>
  );
}
