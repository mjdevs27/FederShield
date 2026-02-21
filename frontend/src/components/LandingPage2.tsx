'use client';

import React from 'react';
import ThreeModel from './ThreeModel';
import { motion } from 'framer-motion';

export default function FedAuraLanding() {
    return (
        <div className="bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">

            {/* 1. HERO SECTION */}
            <section className="relative pt-6 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                    style={{ backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between py-4 bg-white/60 backdrop-blur-md rounded-full px-8 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.1)] mb-16 max-w-5xl mx-auto w-full">
                    <div className="font-bold text-xl tracking-tight text-gray-900">FedAura</div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-gray-900 transition">Product</a>
                        <a href="#" className="hover:text-gray-900 transition">Architecture</a>
                        <a href="#" className="hover:text-gray-900 transition">Resources</a>
                        <a href="#" className="hover:text-gray-900 transition">Pricing</a>
                    </div>
                    <button className="bg-themeDark text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition shadow-lg">
                        Get Started
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex-grow flex flex-col items-center text-center mt-8">
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tight text-gray-900 mb-2 leading-[1.05]">
                        AI That Protects Your
                    </h1>
                    <span className="italic font-extrabold text-indigo-600 text-5xl md:text-8xl mb-8 block">
                        Data 100%
                    </span>

                    <p className="text-gray-500 text-lg md:text-xl max-w-4xl mb-10 font-medium leading-relaxed">
                        Our federated learning framework helps you securely train, aggregate, and scale global models, transforming isolated devices into a powerful AI network.
                    </p>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-full font-bold shadow-2xl shadow-indigo-200 hover:scale-105 transition-all duration-300 mb-20 text-lg">
                        Download Framework
                    </button>

                    {/* 3D Model specifically positioned behind floating cards but above background */}
                    <div className="absolute inset-x-0 top-[450px] md:top-[200px] flex justify-center z-1 pointer-events-none">
                        <ThreeModel
                            width={600}
                            height={900}
                            modelScale={1}
                            className="pointer-events-auto"
                        />
                    </div>

                    {/* Hero Graphics / Floating Cards */}
                    <div className="relative w-full max-w-5xl mt-16 flex justify-center h-[500px]">

                        {/* Floating Card Left - Node Status */}
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            className="absolute top-0 -left-4 md:left-0 bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-20 w-64 border border-white/50"
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Security</p>
                                    <p className="text-sm font-bold text-gray-900">Active Node</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">Integrity</span>
                                    <span className="text-indigo-600">99.9%</span>
                                </div>
                                <div className="h-2 w-full bg-indigo-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '99.9%' }}
                                        transition={{ delay: 1.2, duration: 1.5 }}
                                        className="h-full bg-indigo-600 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Card Right - Compute Stats */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                            className="absolute bottom-20 -right-4 md:right-0 bg-gray-900 p-7 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] z-20 w-72 border border-white/10"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-1">Compute Hub</h4>
                                    <p className="text-gray-400 text-xs font-medium">Processing local gradients</p>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_15px_rgba(129,140,248,0.8)]"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
                                    <p className="text-[10px] text-gray-500 mb-1 font-bold tracking-wider">EPOCHS</p>
                                    <p className="text-white font-mono text-lg">128/300</p>
                                </div>
                                <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
                                    <p className="text-[10px] text-gray-500 mb-1 font-bold tracking-wider">LATENCY</p>
                                    <p className="text-indigo-400 font-mono text-lg">14ms</p>
                                </div>
                            </div>

                            <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-900/20">
                                View Cluster Details
                            </button>
                        </motion.div>

                        {/* Floating Card Top - Global Model */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="absolute top-40 right-1/4 bg-white p-5 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-gray-100"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Distribution</p>
                                <span className="text-gray-900 text-sm font-bold tracking-tight">Global Model v.2.4.8</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Dark Bottom Stats Bar */}
            <section className="bg-themeDark w-full rounded-t-[3rem] px-6 py-12 md:py-20 -mt-10 relative z-30 shadow-2xl">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
                    <div className="pt-6 md:pt-0">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">100%</h3>
                        <p className="text-gray-400 text-sm font-medium">Asynchronous Updates</p>
                    </div>
                    <div className="pt-6 md:pt-0">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">30%</h3>
                        <p className="text-gray-400 text-sm font-medium">Byzantine Fault Tolerance</p>
                    </div>
                    <div className="pt-6 md:pt-0">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">Zero</h3>
                        <p className="text-gray-400 text-sm font-medium">Raw Data Exposed</p>
                    </div>
                </div>
            </section>

            {/* 2. SPLIT FEATURE SECTION - DECENTRALIZED TRAINING */}
            <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative overflow-hidden">
                {/* Subtle Background Accent */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                            Edge Computing
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
                            Decentralized <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-indigo-400">
                                Training Engine
                            </span>
                        </h2>
                        <p className="text-gray-500 mb-10 text-xl leading-relaxed max-w-xl font-medium">
                            Collaborate in real-time by linking remote clients and edge devices from anywhere in the world. Train continuously without centralizing sensitive datasets.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-xl">
                                Start Node
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                            </button>
                            <button className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3">
                                View Documentation
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 relative flex justify-center items-center"
                    >
                        {/* Main Visualization Container */}
                        <div className="relative w-full max-w-[500px] aspect-[4/5] bg-gray-900 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group">
                            {/* Abstract Data Visualization (Placeholder replaced with meaningful UI) */}
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-indigo-500/20 to-transparent"></div>
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
                                className="w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-1000"
                                alt="Decentralized Core"
                            />

                            {/* Inner Code/Data Overlay */}
                            <div className="absolute inset-8 flex flex-col justify-end">
                                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="text-[10px] text-white/50 font-mono">ENCRYPTED_STREAM_ACTIVE</div>
                                    </div>
                                    <div className="space-y-2 h-20 overflow-hidden font-mono text-[10px] text-indigo-300/80">
                                        <p>&gt; initializing_secure_handshake...</p>
                                        <p>&gt; spreading_gradients_to_shard_04...</p>
                                        <p>&gt; byzantine_tolerance_verified: true</p>
                                        <p>&gt; global_model_sync_complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction UI */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-12 top-10 bg-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 w-52 border border-gray-50"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Add Nodes</h4>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Scalable</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 w-3/4 rounded-full"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 bottom-10 bg-white p-6 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-20 flex flex-col items-center border border-gray-50 min-w-[140px]"
                        >
                            <div className="text-3xl font-black text-indigo-600 mb-1">98.2%</div>
                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest text-center">System<br />Availability</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3. THREE CARDS & HOW IT WORKS */}
            <section className="bg-[#F8F9FB] py-32 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Revolutionize Your AI Workflows</h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-medium">Our robust architecture handles stragglers, non-IID data, and sophisticated threat models natively.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        {[
                            { title: "Asynchronous Learning", desc: "No more waiting for slow nodes. Clients upload local updates independently, preventing bottlenecks.", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
                            { title: "Robust Aggregation", desc: "Advanced trimmed mean and median algorithms automatically filter out noisy or poisoned gradients.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                            { title: "Threat Mitigation", desc: "Detect and isolate malicious clients attempting to skew the global model through targeted attacks.", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-4xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-8">
                                    <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-20">
                        <div className="w-full lg:w-5/12">
                            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Our AI framework streamlines the entire federated learning lifecycle, from distributing the global model to robustly aggregating secure gradients.
                            </p>
                            <button className="bg-themeDark text-white px-8 py-3.5 rounded-full font-semibold hover:bg-black transition">
                                Start the Process
                            </button>
                        </div>

                        <div className="w-full lg:w-7/12 relative">
                            <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-linear-to-b from-indigo-200 to-transparent"></div>
                            <div className="space-y-10 relative">
                                {[
                                    { step: "01", title: "Client fetches global model", desc: "A participating edge device downloads the latest global model weights securely from the central aggregator." },
                                    { step: "02", title: "Local training on private data", desc: "The model trains strictly on the client's local device. Raw user data never leaves the hardware." },
                                    { step: "03", title: "Async gradient transmission", desc: "Once local epochs are complete, the client pushes encrypted gradients back without waiting for other peers." },
                                    { step: "04", title: "Robust aggregation & update", desc: "The server validates updates, filters anomalies, and merges the weights to improve the global model." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 relative">
                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200 shrink-0 relative z-10 border-4 border-[#F8F9FB]">
                                            {item.step}
                                        </div>
                                        <div className={"pb-10 border-b border-gray-200 w-full" + (i === 3 ? " border-none pb-0" : "")}>
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. THE PROOF IN THE NUMBERS */}
            <section className="py-32 bg-white text-center">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Proof In The Numbers</h2>
                    <p className="text-gray-500 mb-20">Our aggregation system doesn't just promise stability, it delivers it. See the impact.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { color: "text-indigo-500", border: "border-indigo-400", val: "10,000+", label: "Clients Handled Async" },
                            { color: "text-rose-400", border: "border-rose-300", val: "99.9%", label: "Training Convergence" },
                            { color: "text-orange-400", border: "border-orange-400", val: "30%", label: "Malicious Nodes Defeated" }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center">
                                <div className={`w-56 h-56 rounded-full border-[6px] border-dashed ${stat.border} border-opacity-60 flex flex-col items-center justify-center animate-[spin_30s_linear_infinite] p-2`}>
                                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center animate-[spin_30s_linear_infinite_reverse]">
                                        <h3 className={`text-4xl font-extrabold text-gray-900 mb-2`}>{stat.val}</h3>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center px-4">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. MASSIVE FOOTER */}
            <footer className="bg-themeDark text-white pt-24 px-6 lg:px-16 rounded-t-[3rem] overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
                        <h2 className="text-4xl md:text-5xl font-medium leading-tight max-w-sm">
                            Smarter Training Starts with AI
                        </h2>
                        <div className="flex gap-16 text-sm">
                            <div className="flex flex-col gap-4">
                                <span className="font-bold text-white mb-2">Platform</span>
                                <a href="#" className="text-gray-400 hover:text-white transition">Features</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Security</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Research</a>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="font-bold text-white mb-2">Company</span>
                                <a href="#" className="text-gray-400 hover:text-white transition">About Us</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Careers</a>
                                <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm border-t border-white/10 pt-8 mb-8 z-10 relative">
                        <p>© 2026 FedAura All Rights Reserved</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms Of Use</a>
                        </div>
                    </div>
                    <div className="w-full text-center relative mt-10 -mb-6 md:-mb-10 lg:-mb-16">
                        <h1 className="font-bold text-[18vw] leading-none tracking-tighter text-white/95 select-none">
                            FedAura
                        </h1>
                    </div>
                </div>
            </footer>
        </div>
    );
}