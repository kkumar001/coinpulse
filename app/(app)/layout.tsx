import AuthGate from "@/components/AuthGate";
import Header from "@/components/Header";
import { fetcher } from "@/lib/coingecko.actions";

export default async function AppLayout({
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
    <AuthGate>
      <Header trendingCoins={trendingCoins} />
      {children}
    </AuthGate>
  );
}
