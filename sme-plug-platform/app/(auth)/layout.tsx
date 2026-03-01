import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-canvas flex items-center justify-center px-4 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

            {/* Central glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    width: "600px",
                    height: "600px",
                    background: "radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 60%)",
                }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2.5 no-underline group">
                        <div
                            className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                            style={{
                                background: "linear-gradient(135deg, #a3e635, #65a30d)",
                                clipPath:
                                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            }}
                        />
                        <span className="font-mono font-bold text-xl text-text-primary tracking-tight">
                            te<span className="text-lime">ther</span>
                        </span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
