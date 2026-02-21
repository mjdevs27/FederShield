import React from 'react';

// --- Types & Interfaces ---
interface FeatureCardProps {
    title: string;
    description: string;
    imageUrl: string;
    transformClasses: string;
    isCenter?: boolean;
}

// --- Sub-components ---
const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    imageUrl,
    transformClasses,
    isCenter = false
}) => {
    return (
        <div
            className={`absolute transition-all duration-500 hover:-translate-y-4 hover:z-50 ${transformClasses} ${isCenter
                ? 'w-64 h-80 bg-themeDark border-2 border-themeYellow shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] z-30'
                : 'w-48 h-64 bg-gray-900 border border-gray-700 shadow-xl hidden md:block'
                } rounded-2xl overflow-hidden group`}
        >
            <img
                src={imageUrl}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCenter ? 'opacity-40' : 'opacity-60'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent flex flex-col justify-end p-5 text-left">
                <h3 className={`text-white font-serif italic mb-2 ${isCenter ? 'text-2xl' : 'text-lg'}`}>
                    {title}
                </h3>
                <p className={`text-white/70 leading-relaxed ${isCenter ? 'text-sm' : 'text-xs'}`}>
                    {description}
                </p>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function FedAuraLanding() {
    return (
        <div className="bg-themeDark text-white antialiased overflow-x-hidden selection:bg-themeYellow selection:text-themeDark font-sans">

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-between pb-12 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(23, 23, 23, 0.4), rgba(23, 23, 23, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')" }}>

                {/* Navigation */}
                <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 2L2 22H22L12 2Z" fill="currentColor" />
                        </svg>
                        <span className="font-bold text-xl tracking-wide">FedAura</span>
                    </div>
                    <div className="hidden md:flex bg-white/10 backdrop-blur-md rounded-full px-8 py-3 border border-white/10 gap-8 text-sm font-medium text-white/80 shadow-lg">
                        <a href="#architecture" className="hover:text-white transition">Architecture</a>
                        <a href="#aggregation" className="hover:text-white transition">Aggregation</a>
                        <a href="#privacy" className="hover:text-white transition">Privacy</a>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-6 py-2.5 text-sm font-semibold transition">
                        View Code
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="text-center max-w-5xl px-4 flex-grow flex flex-col justify-start mt-16 items-center z-10">
                    <h1 className="text-6xl md:text-8xl font-semibold tracking-tight mb-6 leading-[1.1]">
                        Train models privately <br />

                    </h1>
                    <span className="text-4xl md:text-6xl font-serif italic font-light text-white/90 font-light">Analyze, aggregate, scale</span>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed">
                        An asynchronous federated learning copilot that handles unreliable clients, mitigates malicious nodes, and achieves convergence natively.
                    </p>
                    <button className="bg-white text-themeDark rounded-full pl-8 pr-2 py-2 flex items-center gap-6 hover:scale-105 transition-transform duration-300 font-bold text-sm uppercase tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                        Start Practice
                        <div className="bg-themeDark rounded-full p-3">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            </section>

            {/* CARDS SECTION */}
            <section className="bg-white text-themeDark py-32 relative">
                <div className="max-w-7xl mx-auto px-6 text-center">

                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-[0.15em] mb-10">
                        <span className="w-2 h-2 rounded-full bg-themeDark"></span>
                        How FedAura works
                    </div>

                    <h2 className="text-5xl md:text-7xl font-semibold mb-24 leading-tight tracking-tight">
                        From siloed data to insights — <br />
                        <span className="font-serif italic font-light text-6xl md:text-8xl">effortlessly</span>
                    </h2>

                    {/* Fanned Cards Layout Container */}
                    <div className="relative h-[360px] flex justify-center items-end mt-12 mx-auto max-w-4xl">

                        <FeatureCard
                            title="Async Updates"
                            description="Train continuously without waiting for straggler nodes."
                            imageUrl="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"
                            transformClasses="-translate-x-[220px] -rotate-12 translate-y-8 z-10"
                        />

                        <FeatureCard
                            title="Robust Aggregation"
                            description="Utilizes trimmed mean and median to prevent poisoning."
                            imageUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
                            transformClasses="-translate-x-[120px] -rotate-6 translate-y-3 z-20 w-56 h-72"
                        />

                        {/* Center Card */}
                        <FeatureCard
                            title="Total Privacy"
                            description="Raw data never leaves the device. Only secure gradients are shared."
                            imageUrl="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
                            transformClasses="z-30 scale-105"
                            isCenter={true}
                        />

                        <FeatureCard
                            title="Threat Mitigation"
                            description="Automatically detects and isolates malicious clients."
                            imageUrl="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop"
                            transformClasses="translate-x-[120px] rotate-6 translate-y-3 z-20 w-56 h-72"
                        />

                        <FeatureCard
                            title="Heterogeneous"
                            description="Maintains high convergence despite non-IID distributions."
                            imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                            transformClasses="translate-x-[220px] rotate-12 translate-y-8 z-10"
                        />
                    </div>
                </div>
            </section>

            {/* DASHBOARD SECTION */}
            <section className="bg-themeDark py-32 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(23, 23, 23, 1), rgba(23, 23, 23, 0.7)), url('https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=2874&auto=format&fit=crop')" }}>
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-semibold mb-6 text-white tracking-tight">
                            Built for clarity at <span className="font-serif italic font-light">every step</span>
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                            Performance evaluation showing training stability and verifiable results from our production prototype.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Chart Panel */}
                        <div className="md:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex justify-between text-sm text-white/40 mb-8 font-mono tracking-widest uppercase">
                                    <span>100%</span>
                                    <span>Convergence (Non-IID)</span>
                                </div>

                                <div className="flex-grow relative flex items-end mb-8">
                                    {/* Mock SVG Line Chart */}
                                    <svg className="w-full h-48" viewBox="0 0 500 150" preserveAspectRatio="none">
                                        <path d="M0,130 C40,120 60,140 100,100 C140,60 160,80 200,60 C240,40 280,70 320,50 C360,30 400,20 450,40 L500,20" fill="none" stroke="#FDE260" strokeWidth="4" style={{ filter: "drop-shadow(0px 8px 12px rgba(253, 226, 96, 0.5))" }} />
                                    </svg>
                                </div>

                                <div className="mt-auto border-t border-white/10 pt-8">
                                    <h3 className="text-white font-serif italic text-3xl mb-3">Byzantine Fault Tolerance</h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Our robust aggregation algorithm continuously filters out noise and poisoned updates from malicious clients, ensuring stable training curves even under 30% corruption.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Side Panels */}
                        <div className="col-span-1 flex flex-col gap-8">
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 flex-grow flex flex-col justify-end relative overflow-hidden group">
                                <div className="absolute inset-0 bg-themeBlue mix-blend-overlay opacity-20 transition-opacity duration-500 group-hover:opacity-40"></div>
                                <h3 className="text-white font-serif italic text-3xl mb-3 relative z-10">Client Resilience</h3>
                                <p className="text-white/60 text-sm leading-relaxed relative z-10">
                                    Maintains high resilience globally, functioning seamlessly asynchronously even when high volumes of clients drop off mid-training.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-white font-serif italic text-2xl mb-2">Adaptive Mitigation</h3>
                                    <p className="text-white/60 text-sm">Dynamic adjustment of trim thresholds.</p>
                                </div>
                                <div className="relative w-full h-3 bg-black/40 rounded-full mt-8 border border-white/5">
                                    <div className="absolute top-0 left-0 h-full bg-themeGreen rounded-full w-3/4 shadow-[0_0_15px_rgba(113,254,17,0.4)]"></div>
                                    <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-themeYellow border-4 border-themeDark rounded-full cursor-pointer hover:scale-125 transition-transform"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}