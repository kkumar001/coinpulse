"use client";

import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SearchModal } from "./SearchModal";

const Header = ({ trendingCoins = [] }: HeaderProps) => {
    const path = usePathname();

    return (
        <header>
            <div className="main-container inner">
                <Link href="/">
                    <Image
                        src="/assets/logo.svg"
                        alt="logo"
                        width={132}
                        height={40}
                    />
                </Link>

                <nav>
                    <Link href="/" className={cn('nav-link', {
                        'is-active': path === "/",
                        'is-home': true
                    })}>Home</Link>
                    <SearchModal initialTrendingCoins={trendingCoins} />
                    <Link href="/coins" className={cn('nav-link', {
                        'is-active': path === '/coins',
                    })}>All Coins</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
