"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <section className="h-screen flex flex-col gap-4 items-center justify-center">
                <Image
                    src="/assets/logo.svg"
                    alt="logo"
                    width={200}
                    height={60.5}
                />
                <Loader className="size-8 animate-spin" />
            </section>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}