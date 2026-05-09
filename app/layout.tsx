import { Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";

const notoThai = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Bangkok's Stray Cats",
  description: "Community map for stray cats in Bangkok",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${notoThai.className} bg-[#E2E2E2] min-h-screen`}>
        <div className="max-w-[390px] mx-auto min-h-screen bg-[#F5F0E6] shadow-2xl flex flex-col relative overflow-hidden">
          <NavigationWrapper />
          <main className="flex-1 w-full flex flex-col relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
