'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Cpu,
    Zap,
    Copy,
    Check,
    ExternalLink,
    Database,
    ChevronRight,
    Code,
    Terminal,
    Sparkles,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PredefinedModel {
    id: string;
    name: string;
    hfId: string;
    description: string;
    type: 'Classification' | 'Seq2Seq' | 'Generation';
    notebookId: string;
    snippets: {
        title: string;
        code: string;
    }[];
}

const MODELS: PredefinedModel[] = [
    {
        id: 'finbert',
        name: 'FinBERT-India',
        hfId: 'Vansh180/FinBERT-India-v1',
        description: 'Specialized for sentiment analysis in the Indian financial sector, covering NSE/BSE news and corporate filings.',
        type: 'Classification',
        notebookId: '3f843335-fa9d-408e-afd1-a64a9c23be4e',
        snippets: [
            {
                title: 'High-level pipeline',
                code: 'import torch\nfrom transformers import pipeline\n\npipe = pipeline("text-classification", model="Vansh180/FinBERT-India-v1")'
            }
        ]
    },
    {
        id: 'flan-t5',
        name: 'Google Flan-T5',
        hfId: 'google/flan-t5-small',
        description: 'A versatile text-to-text generation model fine-tuned on a collection of tasks for zero-shot and few-shot inference.',
        type: 'Seq2Seq',
        notebookId: 'google-flan-t5-small-notebook',
        snippets: [
            {
                title: 'Load model directly',
                code: 'import torch\nfrom transformers import AutoTokenizer, AutoModelForSeq2SeqLM\n\ntokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")\nmodel = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")'
            }
        ]
    }
];

export default function PersictPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-12 font-sans overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 blur-[120px] rounded-full z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Shield size={20} className="text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.4em]">Integrated Intelligence</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                                Persistent<br />
                                <span className="text-white/20">Models</span>
                            </h1>
                            <p className="mt-6 text-white/40 max-w-lg font-light leading-relaxed">
                                Pre-configured neural architectures ready for deployment on the FedAura cluster. Connect these models to your edge nodes for private inference.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {MODELS.map((model) => (
                        <ModelCard key={model.id} model={model} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModelCard({ model }: { model: PredefinedModel }) {
    const [copied, setCopied] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/2 border border-white/5 rounded-[3rem] p-10 hover:bg-white/4 transition-all group overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] pointer-events-none" />

            <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2.5xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl group-hover:shadow-indigo-500/20">
                    {model.type === 'Classification' ? <Zap size={28} /> : <Sparkles size={28} />}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    <Database size={10} />
                    {model.hfId.split('/')[0]}
                </div>
            </div>

            <h3 className="text-3xl font-black tracking-tight mb-3">{model.name}</h3>
            <p className="text-sm text-white/30 font-light leading-relaxed mb-8 max-w-md">
                {model.description}
            </p>

            <div className="space-y-6 mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <Code size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Transformers library integration</span>
                </div>
                {model.snippets.map((snipp, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-center group/snipp">
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{snipp.title}</span>
                            <button
                                onClick={() => handleCopy(snipp.code, idx)}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                {copied === idx ? <Check size={14} className="text-indigo-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 overflow-x-auto">
                            <pre className="font-mono text-xs text-white/60 leading-relaxed whitespace-pre font-medium">
                                {snipp.code}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                <Link
                    href={`/dashboard/notebooks/${model.notebookId}`}
                    className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 relative group"
                >
                    <Terminal size={14} />
                    Open with Code
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-indigo-500 text-white text-[7px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        INCLUDES DEPS
                    </div>
                </Link>
                <div className="flex gap-4">
                    <button className="px-6 py-5 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                        Docs
                    </button>
                    <button className="px-6 py-5 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
