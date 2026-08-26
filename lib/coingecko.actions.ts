'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  const response = await fetch(url, {
    headers: {
      'x-cg-pro-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}

function mapOnchainPool(resource?: OnchainPoolResource): PoolData {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (!resource?.id) return fallback;

  const address = resource.attributes?.address ?? "";
  const networkFromRel = resource.relationships?.network?.data?.id ?? "";
  const evmSep = resource.id.indexOf("_0x");
  const sep = evmSep !== -1 ? evmSep : resource.id.lastIndexOf("_");
  const networkFromId = sep > 0 ? resource.id.slice(0, sep) : "";

  return {
    id: resource.id,
    address,
    name: resource.attributes?.name ?? "",
    network: networkFromRel || networkFromId,
  };
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback = mapOnchainPool();

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: OnchainPoolResource[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );

      return mapOnchainPool(poolData.data?.[0]) ?? fallback;
    } catch {
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: OnchainPoolResource[] }>(
      "/onchain/search/pools",
      { query: id }
    );

    return mapOnchainPool(poolData.data?.[0]) ?? fallback;
  } catch {
    return fallback;
  }
}

interface CoinSearchHit {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const searchData = await fetcher<{ coins: CoinSearchHit[] }>(
      '/search',
      { query: trimmed },
      30,
    );

    const matches = searchData.coins?.slice(0, 10) ?? [];
    if (matches.length === 0) return [];

    const markets = await fetcher<CoinMarketData[]>(
      '/coins/markets',
      {
        vs_currency: 'usd',
        ids: matches.map((coin) => coin.id).join(','),
        per_page: matches.length,
        sparkline: false,
        price_change_percentage: '24h',
      },
      30,
    );

    const marketById = new Map(markets.map((market) => [market.id, market]));

    return matches.map((coin) => {
      const market = marketById.get(coin.id);

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        market_cap_rank: coin.market_cap_rank,
        thumb: coin.thumb || coin.large,
        large: coin.large || coin.thumb,
        data: {
          price: market?.current_price,
          price_change_percentage_24h: market?.price_change_percentage_24h ?? 0,
        },
      };
    });
  } catch {
    return [];
  }
}