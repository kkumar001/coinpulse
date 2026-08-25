"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Input } from './ui/input';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
    const [currency, setCurrency] = useState<string>('usd');
    const [amount, setAmount] = useState<string>('10');

    const convertedPrice = ((parseFloat(amount) || 0) * (priceList[currency] || 0));

    return (
        <div id='converter'>
            <h4>{symbol.toUpperCase()} Converter</h4>

            <div className='panel'>
                <div className='input-wrapper'>
                    <Input
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder='Amount'
                        className='input'
                    />

                    <div className='coin-info'>
                        <Image src={icon} alt={symbol} width={20} height={20} />
                        <p>{symbol.toUpperCase()}</p>
                    </div>
                </div>

                <div className='divider'>
                    <div className='line' />

                    <Image src='/assets/converter.svg' alt='converter' width={32} height={32} className='icon' />
                </div>

                <div className='output-wrapper'>
                    <p>{formatCurrency(convertedPrice, 2, currency, false)}</p>

                    <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="select-trigger" value={currency}>
                            <SelectValue placeholder="Select" className='select-value'>
                                {currency.toUpperCase()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent data-converter className='select-content'>
                            {Object.keys(priceList).map((currenycode) => (
                                <SelectItem key={currenycode} value={currenycode}>
                                    {currenycode.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default Converter
