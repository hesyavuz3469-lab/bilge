import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bilge – Türkçe Trivia Oyunu",
  description: "Her gün yeni sorular, 8 kategori, XP sistemi. Türkiye'nin en iyi trivia oyunu!",
  keywords: ["trivia", "türkçe bilgi yarışması", "bilge", "günlük oyun", "quiz"],
  openGraph: {
    title: "Bilge – Türkçe Trivia Oyunu",
    description: "Her gün yeni 10 soru! Kategoriler, XP, liderboard.",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-2649583964814971",
  },
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-2649583964814971";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#020817]">
        {children}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
