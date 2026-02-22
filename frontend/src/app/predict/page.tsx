'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Activity,
    Search,
    Cpu,
    Zap,
    Terminal,
    Play,
    Copy,
    Check,
    ExternalLink,
    Database,
    ChevronRight,
    MessageSquare,
    TrendingUp,
    Shield,
    FileCode,
    Loader2,
    Code,
    Table as TableIcon,
    AlertCircle,
    Info,
    ChevronLeft,
    Plus,
    Save,
    Trash,
    MoveUp,
    MoveDown,
    FileText,
    RefreshCw,
    Eraser
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Cell {
    id: string;
    type: 'code' | 'markdown';
    content: string;
    output?: string;
    isExecuting?: boolean;
}

const DEFAULT_MODEL = "Vansh180/FinBERT-India-v1";

const INITIAL_CELLS: Cell[] = [
    {
        id: '1',
        type: 'markdown',
        content: `# Model Deployment: ${DEFAULT_MODEL}\nThis notebook demonstrates how to load the FinBERT model for Indian financial sentiment analysis and perform live predictions.`
    },
    {
        id: '2',
        type: 'code',
        content: `# Install transformers if not present\n!pip install transformers torch`,
        output: "Requirement already satisfied: transformers in /usr/local/lib/python3.10/dist-packages\nRequirement already satisfied: torch in /usr/local/lib/python3.10/dist-packages"
    },
    {
        id: '3',
        type: 'code',
        content: `from transformers import pipeline\n\n# Initialize high-level pipeline\npipe = pipeline("text-classification", model="${DEFAULT_MODEL}")`,
        output: "Model loaded successfully. GPU acceleration active (Found 1 Tesla T4)."
    },
    {
        id: '4',
        type: 'code',
        content: `text = "HDFC Bank reports 20% surge in quarterly profits, exceeding analyst expectations."\nprediction = pipe(text)\nprint(f"Text: {text}")\nprint(f"Inference: {prediction}")`,
        output: "Text: HDFC Bank reports 20% surge in quarterly profits, exceeding analyst expectations.\nInference: [{'label': 'positive', 'score': 0.9842}]"
    }
];

export default function PredictPage() {
    const [modelId, setModelId] = useState(DEFAULT_MODEL);
    const [cells, setCells] = useState<Cell[]>(INITIAL_CELLS);
    const [inputText, setInputText] = useState("RBI maintains status quo on repo rates, market yields stabilize.");
    const [isDeploying, setIsDeploying] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const runPrediction = () => {
        const predictionCellId = Math.random().toString(36).substr(2, 9);
        const newCell: Cell = {
            id: predictionCellId,
            type: 'code',
            content: `inputs = ["${inputText}"]\nresults = pipe(inputs)\nprint(results)`,
            isExecuting: true
        };

        setCells(prev => [...prev, newCell]);

        // Simulate execution
        setTimeout(() => {
            const mockScore = 0.85 + Math.random() * 0.14;
            const mockLabel = inputText.toLowerCase().includes('surge') || inputText.toLowerCase().includes('profits') || inputText.toLowerCase().includes('stabilize') ? 'positive' : 'neutral';

            setCells(prev => prev.map(c =>
                c.id === predictionCellId
                    ? { ...c, isExecuting: false, output: `[{'label': '${mockLabel}', 'score': ${mockScore.toFixed(4)}}]` }
                    : c
            ));
        }, 1500);
    };

    const deployNewModel = () => {
        setIsDeploying(true);
        setCells([]);

        setTimeout(() => {
            setIsDeploying(false);
            setCells([
                {
                    id: 'new-1',
                    type: 'markdown',
                    content: `# Deployment Success: ${modelId}\nModel has been loaded into memory. Ready for inference.`
                },
                {
                    id: 'new-2',
                    type: 'code',
                    content: `from transformers import pipeline\npipe = pipeline("text-classification", model="${modelId}")`,
                    output: `Downloading config.json: 100%|██████████| 821/821 [00:00<00:00, 4.31MB/s]\nDownloading pytorch_model.bin: 100%|██████████| 438M/438M [00:12<00:00, 36.5MB/s]\nPipeline initialized for ${modelId}`
                }
            ]);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Visual background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
            <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 blur-[120px] rounded-full z-0" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/5 blur-[120px] rounded-full z-0" />

            {/* Sidebar Navigation (Mock) */}
            <nav className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/5 bg-[#080808]/50 backdrop-blur-3xl z-50 flex flex-col items-center py-10 gap-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Shield size={24} className="text-black" />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    <NavIcon icon={Cpu} active />
                    <NavIcon icon={Database} />
                    <NavIcon icon={TrendingUp} />
                    <NavIcon icon={MessageSquare} />
                </div>
            </nav>

            <main className="pl-32 pr-12 py-12 max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-8 bg-indigo-500" />
                            <p className="text-[10px] text-indigo-400 uppercase tracking-[0.5em] font-black">AI Deployment Center</p>
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                            Neural<br />
                            <span className="text-white/20">Inference</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={modelId}
                                onChange={(e) => setModelId(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-80 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                placeholder="Hugging Face Model ID..."
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Search size={18} />
                            </div>
                        </div>
                        <button
                            onClick={deployNewModel}
                            disabled={isDeploying}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center gap-2"
                        >
                            {isDeploying ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                            {isDeploying ? 'Deploying...' : 'Deploy'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Panel: Documentation & Code Snippets */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/3 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Code size={20} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none mb-1">Transformers API</h3>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Hugging Face Integration</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <CodeSnippet
                                    title="High-level pipeline"
                                    code={`from transformers import pipeline\npipe = pipeline("text-classification", model="${modelId}")`}
                                    onCopy={() => handleCopy(`from transformers import pipeline\npipe = pipeline("text-classification", model="${modelId}")`, 's1')}
                                    isCopied={copied === 's1'}
                                />

                                <CodeSnippet
                                    title="AutoModel Configuration"
                                    code={`from transformers import AutoTokenizer, AutoModelForSequenceClassification\n\ntokenizer = AutoTokenizer.from_pretrained("${modelId}")\nmodel = AutoModelForSequenceClassification.from_pretrained("${modelId}")`}
                                    onCopy={() => handleCopy(`from transformers import AutoTokenizer, AutoModelForSequenceClassification\n\ntokenizer = AutoTokenizer.from_pretrained("${modelId}")\nmodel = AutoModelForSequenceClassification.from_pretrained("${modelId}")`, 's2')}
                                    isCopied={copied === 's2'}
                                />
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-4">Quick Links</p>
                                <QuickLink label="Model documentation" />
                                <QuickLink label="High-level pipeline docs" />
                                <QuickLink label="Hugging Face resources" />
                            </div>
                        </motion.div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-4xl p-8">
                            <div className="flex items-start gap-4">
                                <AlertCircle size={20} className="text-indigo-400 mt-1 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold mb-2">GPU Acceleration</h4>
                                    <p className="text-xs text-indigo-100/40 leading-relaxed">
                                        FedAura automatically detects compatible CUDA kernels. Pre-loading models to VRAM reduces inference latency by up to 12.5x.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Interactive Notebook Environment */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[800px]">
                            {/* Notebook Header */}
                            <div className="bg-white/3 border-b border-white/5 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                                    </div>
                                    <div className="h-4 w-px bg-white/10 mx-2" />
                                    <div className="flex items-center gap-2">
                                        <Terminal size={14} className="text-white/20" />
                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">runtime: python_3.10_cuda</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button className="text-[10px] text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest">Clear Outputs</button>
                                    <button className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase tracking-widest">Restart Kernel</button>
                                </div>
                            </div>

                            {/* Cells Area */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                                <AnimatePresence mode="popLayout">
                                    {cells.map((cell, idx) => (
                                        <motion.div
                                            key={cell.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group"
                                        >
                                            {cell.type === 'markdown' ? (
                                                <div className="pl-12 prose prose-invert opacity-60">
                                                    <p className="text-sm leading-relaxed">{cell.content}</p>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className="absolute -left-12 top-6 text-[10px] font-mono text-white/10 group-hover:text-indigo-500 transition-colors">
                                                        [{idx + 1}]
                                                    </div>
                                                    <div className="bg-white/3 rounded-3xl p-6 font-mono text-sm border border-white/5 group-hover:border-white/10 transition-all">
                                                        <pre className="text-white/80 whitespace-pre-wrap">{cell.content}</pre>

                                                        {cell.isExecuting ? (
                                                            <div className="mt-4 flex items-center gap-3 text-[10px] text-indigo-400 uppercase tracking-widest font-black animate-pulse">
                                                                <Loader2 size={12} className="animate-spin" />
                                                                Executing...
                                                            </div>
                                                        ) : cell.output && (
                                                            <div className="mt-6 pt-6 border-t border-white/5 text-[12px] text-white/40 font-mono">
                                                                <pre className="whitespace-pre-wrap">{cell.output}</pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Predictions Section */}
                            <div className="p-8 bg-white/2 border-t border-white/5 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Database size={14} className="text-white/20" />
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Data Input Source</span>
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue="/mnt/data/financial_news_batch_01.csv"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            placeholder="Specify CSV/JSON path..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-white/20" />
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Interactive Inference</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && runPrediction()}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                                                placeholder="Ask model something..."
                                            />
                                            <button
                                                onClick={runPrediction}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                                            >
                                                <Play size={14} fill="currentColor" />
                                                Run
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavIcon({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
    return (
        <div className={`p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-white/20 hover:text-white/40'}`}>
            <Icon size={20} />
        </div>
    );
}

function CodeSnippet({ title, code, onCopy, isCopied }: { title: string, code: string, onCopy: () => void, isCopied: boolean }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{title}</span>
                <button
                    onClick={onCopy}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
            <div className="bg-black/40 rounded-2xl p-5 border border-white/5 group relative overflow-hidden">
                <pre className="font-mono text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap">{code}</pre>
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileCode size={12} className="text-white/10" />
                </div>
            </div>
        </div>
    );
}

function QuickLink({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-white/40 group-hover:text-white transition-colors">{label}</span>
            <ExternalLink size={14} className="text-white/10 group-hover:text-indigo-400 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
        </div>
    );
}
