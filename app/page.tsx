// src/app/page.tsx
import NavigationBar from "./components/NavigationBar";
export default function Home() {
  return (
    <main className="flex-1 relative flex flex-col overflow-hidden">
      {/* ลองเปลี่ยนเป็น true หรือ false เพื่อดูความเปลี่ยนแปลงในมือถือครับ */}
      <NavigationBar isLoggedIn={false} />      
      <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-400">
        แผนที่ Leaflet
      </div>
    </main>
  );
}