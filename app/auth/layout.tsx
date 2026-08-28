import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='h-screen flex overflow-hidden w-full'>
            <section className='relative h-screen w-[40%] hidden md:block'>
                <Image
                    src='/assets/auth_cover.png'
                    alt='cover'
                    fill
                    priority
                    className='object-cover object-center'
                />
            </section>
            <section className="relative flex h-screen w-full md:w-[60%] flex-col items-center justify-center gap-6 bg-[#0a0a0a] overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                <div
                    className="pointer-events-none absolute -top-32 -right-32 size-105 rounded-full opacity-30 blur-[110px]"
                    style={{ background: "radial-gradient(circle, #8FE24C 0%, transparent 70%)" }}
                />

                <div
                    className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full opacity-20 blur-[100px]"
                    style={{ background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)" }}
                />

                <svg
                    className="pointer-events-none absolute bottom-0 right-0 h-55 w-80 opacity-[0.06]"
                    viewBox="0 0 320 220"
                    fill="none"
                >
                    {[
                        { x: 20, y: 140, h: 60 },
                        { x: 60, y: 100, h: 90 },
                        { x: 100, y: 160, h: 40 },
                        { x: 140, y: 60, h: 130 },
                        { x: 180, y: 120, h: 70 },
                        { x: 220, y: 40, h: 150 },
                        { x: 260, y: 90, h: 100 },
                    ].map((bar, i) => (
                        <rect key={i} x={bar.x} y={bar.y} width="14" height={bar.h} fill="#8FE24C" rx="2" />
                    ))}
                </svg>

                <div className="relative z-10 flex flex-col items-center gap-3 md:gap-6">
                    <Image src="/assets/logo.svg" alt="logo" width={132} height={40} />
                    <div className="p-4">{children}</div>
                </div>
            </section>
        </main>
    )
}

export default AuthLayout
