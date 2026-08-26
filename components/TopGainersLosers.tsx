'use client';

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TopGainersLosers = ({ data }: { data: TopGainersLosersResponse }) => {
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
    const coins = activeTab === 'gainers' ? data.top_gainers?.slice(0, 5) : data.top_losers?.slice(0, 5);

    const router = useRouter();

    return (
        <div id="top-gainers-losers">
            <div className="tabs-list grid grid-cols-2">
                <button
                    className={cn('tabs-trigger cursor-pointer', activeTab !== 'gainers' && 'opacity-40')}
                    data-state={activeTab === 'gainers' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('gainers')}
                >
                    Top Gainers
                </button>
                <button
                    className={cn('tabs-trigger cursor-pointer', activeTab !== 'losers' && 'opacity-40')}
                    data-state={activeTab === 'losers' ? 'active' : 'inactive'}
                    onClick={() => setActiveTab('losers')}
                >
                    Top Losers
                </button>
            </div>
            <div className="tabs-content">
                {coins.map((coin) => {
                    const isUp = coin.usd_24h_change > 0;

                    return (
                        <button
                            className="tabs-content-item cursor-pointer flex flex-row items-center justify-between gap-3 rounded-xl bg-dark-400 px-4 py-3.5"
                            key={coin.id}
                            onClick={() => router.push(`/coins/${coin.id}`)}
                        >
                            <div className="coin flex min-w-0 items-center gap-3">
                                <Image
                                    src={coin.image}
                                    alt={coin.name}
                                    width={40}
                                    height={40}
                                />
                                <div>
                                    <p className="name">{coin.name}</p>
                                    <p className="symbol text-left!">{coin.symbol}</p>
                                </div>
                            </div>

                            <div className="metrics flex shrink-0 flex-col items-end gap-0.5">
                                <p className="price">{formatCurrency(coin.usd)}</p>
                                <p className={cn('change', isUp ? 'text-green-500' : 'text-red-500')}>
                                    {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {formatPercentage(coin.usd_24h_change)}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default TopGainersLosers
