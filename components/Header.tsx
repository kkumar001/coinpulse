"use client";

import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SearchModal } from "./SearchModal";
import { useAuth } from "@/context/AuthContext";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Loader2, LogOutIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";
import { toast } from "sonner";
import { useState } from "react";

const Header = ({ trendingCoins = [] }: HeaderProps) => {
    const path = usePathname();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignOut() {
        setLoading(true);
        await signOut(auth)
            .then(() => {
                toast.success("Signed out successfully!");
                router.replace('/auth/login');
            })
            .catch((error) => {
                toast.error(error.message || "Something went wrong! Please try again!")
            })
            .finally(() => {
                setLoading(false);
            })
    }

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

                <nav className="mb-0!">
                    <Link href="/" className={cn('nav-link', {
                        'is-active': path === "/",
                        'is-home': true
                    })}>Home</Link>
                    <SearchModal initialTrendingCoins={trendingCoins} />
                    <Link href="/coins" className={cn('nav-link', {
                        'is-active': path === '/coins',
                    })}>All Coins</Link>
                </nav>

                <Popover>
                    <PopoverTrigger className="rounded-full border border-green-500 cursor-pointer">
                        {user?.photoURL ? (
                            <Image
                                src={user?.photoURL as string}
                                alt="profile_pic"
                                height={36}
                                width={36}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center size-9 bg-green-500 rounded-full">
                                <p className="text-2xl font-bold text-black">
                                {user?.email?.charAt(0)?.toUpperCase()}
                                </p>
                            </div>
                        )}
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        className="flex flex-col gap-3"
                    >
                        <article className="flex flex-col">
                            <p className="text-sm">{user?.displayName}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </article>
                        <Separator className="divider" />
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={handleSignOut}
                            disabled={loading}
                            className="cursor-pointer disabled:cursor-not-allowed!"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    <LogOutIcon />
                                    Logout
                                </>
                            )}

                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    )
}

export default Header
