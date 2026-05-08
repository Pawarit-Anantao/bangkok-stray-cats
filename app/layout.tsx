import { Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai_Looped({
  subsets: ["thai"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${notoThai.className} antialiased bg-gray-200`}>
        <div className="max-w-md mx-auto min-h-screen bg-[#F9F6EE] shadow-2xl relative overflow-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}