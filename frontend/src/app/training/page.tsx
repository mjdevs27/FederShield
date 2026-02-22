'use client';

import FederatedTraining from '@/components/FederatedTraining';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TrainingPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <header className="fixed top-0 left-0 right-0 z-50 p-10 flex justify-between items-center pointer-events-none">
                <Link href="/simulation" className="pointer-events-auto group flex items-center gap-4 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl transition-all">
                    <ChevronLeft size={18} className="text-white/40 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Simulation</span>
                </Link>
            </header>

            <FederatedTraining />
        </main>
    );
}
