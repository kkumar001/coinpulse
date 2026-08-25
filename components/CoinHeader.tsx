import React from 'react'
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { Badge } from './ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';

const CoinHeader = ({
    name,
    image,
    livePrice,
    livePriceChangePercentage24h,
    priceChangePercentage30d,
    priceChange24h
}: LiveCoinHeaderProps) => {
    const isTrendingUp = livePriceChangePercentage24h > 0;
    const isThirtyDayUp = priceChangePercentage30d > 0;
    const isPriceChangeUp = priceChange24h > 0;

    const stats = [
        {
            label: 'Today',
            value: livePriceChangePercentage24h,
            isUp: isTrendingUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: '30 Days',
            value: priceChangePercentage30d,
            isUp: isThirtyDayUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: 'Price Change (24h)',
            value: priceChange24h,
            isUp: isPriceChangeUp,
            formatter: formatCurrency,
            showIcon: false
        }
    ]
    return (
        <div id="coin-header">
            <h3>{name}</h3>

            <div id='info'>
                <Image src={image} alt={name} width={77} height={77} />

                <div className='price-row'>
                    <h1>{formatCurrency(livePrice)}</h1>
                    <Badge className={cn('badge', isTrendingUp ? 'badge-up' : 'badge-down')}>
                        {formatPercentage(livePriceChangePercentage24h)}
                        {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
                        &#040;24h&#041;
                    </Badge>
                </div>

                <ul className='stats'>
                    {stats.map((stat) => (
                        <li key={stat.label}>
                            <p className='label'>{stat.label}</p>

                            <div
                                className={cn('value', {
                                    'text-green-500': stat.isUp,
                                    'text-red-500': !stat.isUp
                                })}
                            >
                                <p>{stat.formatter(stat.value)}</p>
                                {stat.showIcon && (stat.isUp ? <TrendingUp className='size-4' /> : <TrendingDown className='size-4' />)}
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CoinHeader
