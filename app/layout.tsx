import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { fetcher } from "@/lib/coingecko.actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoinPulse",
  description: "Crypto Screener App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let trendingCoins: TrendingCoin[] = [];

  try {
    const trending = await fetcher<{ coins: TrendingCoin[] }>(
      "/search/trending",
      undefined,
      300,
    );
    trendingCoins = trending.coins ?? [];
  } catch {
    trendingCoins = [];
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header trendingCoins={trendingCoins} />
        {children}
      </body>
    </html>
  );
}
