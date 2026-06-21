import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

// 본문용 산세리프 폰트
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 코드/모노스페이스용 폰트
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 브라우저 탭/SEO에 노출되는 문서 메타데이터
export const metadata: Metadata = {
  title: "Todo App",
  description: "Next.js와 FastAPI로 만든 Todo 웹 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Tanstack Query 등 전역 Provider로 앱 전체를 감싼다 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
