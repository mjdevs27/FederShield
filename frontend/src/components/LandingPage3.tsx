'use client';

import React from 'react';
import ThreeModel from './ThreeModel';
import { motion } from 'framer-motion';

export default function LandingPage3() {
    return (
        <div className="bg-[#FAF9F6] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* 1. HERO SECTION - ULTRA MODERN LIGHT */}
            <section className="relative min-h-screen flex flex-col pt-8 px-6 lg:px-16 max-w-[1600px] mx-auto">

                {/* Visual Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[140px]"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px]"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-50 flex items-center justify-between py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                            F
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">FedAura</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-12 bg-white/40 backdrop-blur-xl border border-white/60 px-10 py-4 rounded-full shadow-sm">
                        {['Platform', 'Technology', 'Network', 'Ecosystem'].map((item) => (
                            <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors tracking-wide">
                                {item}
                            </a>
                        ))}
                    </div>

                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                        Launch Console
                    </button>
                </nav>

                {/* Hero Content Area */}
                <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center flex-grow py-12">

                    {/* Left Text Detail */}
                    <div className="lg:col-span-12 xl:col-span-7 flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                            Version 4.0 Stable
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-7xl md:text-8xl xl:text-9xl font-black text-slate-900 leading-[1.0] tracking-tighter mb-10"
                        >
                            AI Harmony <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-cyan-400">
                                100% Secure.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-12 font-medium"
                        >
                            Orchestrate private data intelligence across globally distributed nodes without moving a single bit of raw data. The future of AI is decentralized.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="flex flex-wrap gap-5"
                        >
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-300 transition-all hover:scale-105 active:scale-95">
                                Start Training Now
                            </button>
                            <button className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-bold text-lg border-2 border-slate-100 hover:border-indigo-600 transition-all flex items-center gap-3 group">
                                Explore Network
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right 3D Visualization */}
                    <div className="lg:col-span-12 xl:col-span-5 relative h-[600px] xl:h-full flex justify-center items-center">
                        <div className="absolute inset-0 bg-indigo-50/30 rounded-[4rem] blur-[60px] transform -rotate-6"></div>
                        <div className="relative w-full h-full flex justify-center items-center z-10">
                            <ThreeModel
                                width="100%"
                                height="800px"
                                modelScale={1.4}
                                modelPosition={[0, -2.5, 0]}
                                className="drop-shadow-[0_50px_80px_rgba(79,70,229,0.15)]"
                            />
                        </div>

                        {/* Floating Micro-data Cards */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-20 right-[-20px] bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 z-20 w-56"
                        >
                            <div className="flex items-center gap-3 mb-4 font-bold text-sm text-slate-800">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                Privacy Score
                            </div>
                            <div className="text-3xl font-black text-slate-900">A+ Certified</div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-20 left-[-40px] bg-indigo-600 p-8 rounded-[3rem] shadow-2xl z-20 w-64 text-white"
                        >
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Live Nodes</div>
                            <div className="text-4xl font-black mb-4">12,842</div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-slate-200 overflow-hidden">
                                        <img src={`https://avatar.iran.liara.run/public/boy?username=${i}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                                    +8k
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. VALUE STATS SECTION */}
            <section className="py-24 bg-white border-y border-slate-50">
                <div className="max-w-[1400px] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-16">
                    {[
                        { val: "Zero", label: "Data Leaks", sub: "End-to-end encrypted tunnels" },
                        { val: "400ms", label: "Latency", sub: "Ultra-fast aggregation cycle" },
                        { val: "30%", label: "Faster Convergence", sub: "Async SGD optimizations" },
                        { val: "Unlimited", label: "Scalability", sub: "Handles 1M+ edge clients" }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <span className="text-5xl font-black text-indigo-600 mb-3 tracking-tighter">{stat.val}</span>
                            <span className="text-lg font-black text-slate-900 mb-1">{stat.label}</span>
                            <span className="text-sm font-medium text-slate-400">{stat.sub}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. FEATURE SECTION - CLEAN GRID */}
            <section className="py-32 px-10 max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center text-center mb-24">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Engineered for High-Stakes AI.
                    </h2>
                    <p className="text-xl text-slate-500 max-w-3xl font-medium">
                        Our framework abstracts away the complexity of distributed training, allowing you to focus on building world-class models.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Smart Aggregation", desc: "Native support for Byzantine-robust algorithms that filter out malicious updates automatically.", color: "bg-indigo-50", text: "text-indigo-600" },
                        { title: "Infinite Edge", desc: "Deploy your model to millions of IoT devices, mobile apps, or browsers with a single command.", color: "bg-emerald-50", text: "text-emerald-600" },
                        { title: "Proof of Training", desc: "Blockchain-backed verification ensures every gradient update is legitimate and untampered.", color: "bg-amber-50", text: "text-amber-600" }
                    ].map((feature, i) => (
                        <div key={i} className={`p-12 rounded-[3.5rem] ${feature.color} border border-white/50 group hover:scale-[1.02] transition-all duration-500`}>
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center mb-10 group-hover:-translate-y-2 transition-transform">
                                <svg className={`w-8 h-8 ${feature.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-6">{feature.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. CTA FOOTER */}
            <footer className="px-10 pb-20">
                <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[4rem] p-20 text-center relative overflow-hidden">
                    <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"></div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-10 relative z-10">
                        Ready to decentralize?
                    </h2>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 relative z-10">
                        Join 2,000+ teams who are building the next generation of private AI on FedAura.
                    </p>
                    <div className="flex justify-center gap-6 relative z-10">
                        <button className="bg-white text-slate-900 px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-all">
                            Get Started
                        </button>
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 font-bold text-sm">
                        <div className="flex items-center gap-2 mb-8 md:mb-0">
                            <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-[10px]">F</div>
                            <span>© 2026 FedAura</span>
                        </div>
                        <div className="flex gap-10">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="hover:text-white transition-colors">Discord</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
