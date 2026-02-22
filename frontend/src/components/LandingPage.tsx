'use client';

import React from 'react';
import ThreeModel from './ThreeModel';
import { motion } from 'framer-motion';

export default function LandingPage() {
    return (
        <div className="bg-[#050505] text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

            {/* 1. HERO SECTION - ATMOSPHERIC DARK */}
            <section className="relative min-h-[110vh] flex flex-col pt-6 px-6 lg:px-12">

                {/* Visual Background - Deep Glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[160px]"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>

                {/* Navigation - Minimalist Glass */}
                <nav className="relative z-50 flex items-center justify-between py-6 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="font-medium text-xl tracking-[0.2em] text-white/90 uppercase">FedAura</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10 bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full shadow-2xl">
                        {/* {['Compute', 'Security', 'Network', 'Pricing'].map((item) => (
                            <a key={item} href="#" className="text-[11px] font-bold text-white/40 hover:text-white transition-all tracking-[0.15em] uppercase">
                                {item}
                            </a>
                        ))} */}
                        {/* <div className="w-px h-4 bg-white/10 mx-2"></div> */}
                        <a href="/simulation" className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-all tracking-[0.15em] uppercase">
                            Simulation
                        </a>
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <a href="/fl" className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-all tracking-[0.15em] uppercase">
                            Edge Learning
                        </a>
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <a href="/node-simulation" className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-all tracking-[0.15em] uppercase">
                            Node Sim
                        </a>
                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                        <a href="/dashboard/persict" className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-all tracking-[0.15em] uppercase">
                            Persistent Models
                        </a>
                    </div>

                    {/* <button className="text-white bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all active:scale-95 tracking-widest uppercase">
                        Sign In
                    </button> */}
                </nav>

                {/* Massive Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-20">

                    {/* Top Detail */}
                    {/* <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-12"
                    >
                        Federated AI Infrastructure
                    </motion.div> */}

                    <div className="relative w-full max-w-6xl text-center">
                        {/* THE TITLE - MIXED WEIGHTS */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[0.9] tracking-[-0.04em] relative"
                        >
                            <span className="font-extralight text-white/40">Secure</span> <br />
                            <span className="font-extrabold text-white">Distributed Data.</span>
                        </motion.h1>

                        {/* SUBTITLE */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="mt-12 text-white/40 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed tracking-wide"
                        >
                            The protocol for private machine learning. Train resilient global models across millions of devices without exposing raw intelligence.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="mt-16 flex flex-col sm:flex-row gap-6 relative z-10"
                    >
                        <a href="/simulation" className="bg-white text-black px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-2xl shadow-white/10 text-center">
                            Launch Simulation
                        </a>
                        <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all">
                            Read Architecture
                        </button>
                    </motion.div>

                    {/* THE 3D MODEL - MASSIVE BACKGROUND PRESENCE */}
                    <div className="absolute inset-x-0 top-[50%] md:top-[80%] h-[900px] flex justify-center z-0 pointer-events-none">
                        <div className="relative w-full h-full max-w-[1200px]">
                            {/* Layered Glow behind model */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[180px]"></div>

                            <ThreeModel
                                width="100%"
                                height="100%"
                                modelScale={0.9}
                                modelPosition={[0, -2, 0]}
                                className="opacity-70 saturate-[0.8] brightness-[1.2]"
                            />
                        </div>
                    </div>

                    {/* Atmospheric Floating Labels */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute top-1/4 left-20 border-l border-white/20 pl-4 py-2"
                        >
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">Status</span>
                            <span className="text-xs font-bold text-indigo-400">ENCRYPTED_FLOW</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute bottom-1/4 right-20 border-r border-white/20 pr-4 py-2 text-right"
                        >
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30 mb-1">Throughput</span>
                            <span className="text-xs font-bold text-purple-400">1.2 GB/S REDUCED</span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. VALUE GRID - MINIMALIST */}
            <section className="py-20 px-10 border-t border-white/5 bg-[#080808]">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {[
                        { val: "2M+", label: "ACTIVE DEVICES" },
                        { val: "100%", label: "DATA PRIVACY" },
                        { val: "14ms", label: "NODE LATENCY" },
                        { val: "AES-GCM", label: "HANDSHAKE" }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-2xl font-extralight tracking-widest text-white mb-2">{s.val}</span>
                            <span className="text-[10px] font-bold text-white/30 tracking-[0.4em] uppercase">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. CORE ARCHITECTURE - VISUAL CARDS */}
            <section className="py-40 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-32">
                    <h2 className="text-4xl md:text-5xl font-extralight text-center tracking-tighter text-white/90">
                        Designed for <span className="font-extrabold text-white">Scale.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] hover:bg-white/[0.04] transition-all">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full mb-8 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <h3 className="text-3xl font-bold mb-6">Asynchronous Aggregation</h3>
                        <p className="text-white/40 text-lg leading-relaxed max-w-lg font-light">
                            Minimize training overhead with real-time gradient updates. Our protocol handles millions of edge connections without central server synchronization bottlenecks.
                        </p>
                    </div>

                    <div className="md:col-span-4 bg-indigo-600 p-12 rounded-[3rem] text-white flex flex-col justify-between hover:scale-105 transition-all duration-500">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-full mb-8 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 tracking-tight">Zero-Knowledge Verification</h3>
                        </div>
                        <p className="text-white/80 font-medium">Verify gradient integrity without viewing local datasets.</p>
                    </div>
                </div>
            </section>

            {/* 4. FUTURISTIC FOOTER */}
            <footer className="py-20 px-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-6 md:mb-0">FedAura Core Protocol 2026</span>
                    <div className="flex gap-12 font-bold text-[10px] tracking-widest uppercase">
                        <a href="#" className="hover:text-indigo-400">Terminal</a>
                        <a href="#" className="hover:text-indigo-400">Network</a>
                        <a href="#" className="hover:text-indigo-400">Status</a>
                    </div>
                </div>
                <div className="text-center mt-20 opacity-5">
                    <h1 className="text-[20vw] font-black leading-none tracking-tighter">FEDAURA</h1>
                </div>
            </footer>
        </div>
    );
}
