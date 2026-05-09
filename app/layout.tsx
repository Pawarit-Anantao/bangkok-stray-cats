import { Noto_Sans_Thai_Looped, Bebas_Neue } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";

const notoThai = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  weight: ["400", "700","800","900"],
});

const bebas = Bebas_Neue({
  weight: "400", // Bebas Neue มีแค่น้ำหนักเดียวคือ 400
  subsets: ["latin"],
});

export const metadata = {
  title: "Bangkok's Stray Cats",
  description: "Community map for stray cats in Bangkok",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${notoThai.className} ${bebas.className} bg-[#E2E2E2] m-0 p-0 flex justify-center items-start min-h-screen`}>
        <div className="w-full max-w-[390px] min-h-screen bg-[#F5F0E6] shadow-2xl flex flex-col relative overflow-hidden">
          <NavigationWrapper />
          <main className="flex-1 w-full flex flex-col overflow-hidden min-h-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}