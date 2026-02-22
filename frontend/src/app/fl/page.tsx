'use client';

import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import {
    Upload,
    Zap,
    ChevronLeft,
    ShieldCheck,
    FileJson,
    Terminal,
    Play,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { registerClient, downloadLatestModel, uploadTrainedUpdate, UpdateResponse } from '@/lib/fl-api';
import FLProgress, { StepStatus } from '@/components/FLProgress';

type FLStepId = 'register' | 'download' | 'parse' | 'training' | 'upload';

interface FLStep {
    id: FLStepId;
    label: string;
    status: StepStatus;
}

const INITIAL_STEPS: FLStep[] = [
    { id: 'register', label: '1. Handshake with GCP Hub', status: 'pending' },
    { id: 'download', label: '2. Synchronizing Large Model', status: 'pending' },
    { id: 'parse', label: '3. Parsing Local Dataset', status: 'pending' },
    { id: 'training', label: '4. CPU Compute (WASM)', status: 'pending' },
    { id: 'upload', label: '5. Secure Weights Push', status: 'pending' },
];

export default function FederatedLearningPage() {
    const [file, setFile] = useState<File | null>(null);
    const [steps, setSteps] = useState<FLStep[]>(INITIAL_STEPS);
    const [progress, setProgress] = useState(0);
    const [downloadInfo, setDownloadInfo] = useState({ loaded: 0, total: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UpdateResponse | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const workerRef = useRef<Worker | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const updateStepStatus = (id: FLStepId, status: StepStatus) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const resetFlow = () => {
        setSteps(INITIAL_STEPS);
        setProgress(0);
        setDownloadInfo({ loaded: 0, total: 0 });
        setError(null);
        setResult(null);
        setLogs([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            resetFlow();
            addLog(`Selected: ${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`);
        }
    };

    const startTraining = async () => {
        if (!file) return;

        setIsRunning(true);
        setError(null);
        setResult(null);
        setSteps(INITIAL_STEPS);
        addLog("Protocol Genesis: Booting Pipeline...");

        try {
            // 1. Register Client
            updateStepStatus('register', 'active');
            const { client_id, current_model_version } = await registerClient();
            updateStepStatus('register', 'completed');
            addLog(`GCP Authenticated: ${client_id.slice(0, 12)}`);

            // 2. Download Model (With progress)
            updateStepStatus('download', 'active');
            const { modelBuffer, parentVersion } = await downloadLatestModel('exp1', (pct, loaded, total) => {
                setDownloadInfo({ loaded, total });
                if (pct % 25 === 0) addLog(`Syncing model: ${pct}%...`);
            });
            updateStepStatus('download', 'completed');
            addLog(`Global Model Bytes Acquired: ${(modelBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

            // 3. Parse CSV
            updateStepStatus('parse', 'active');
            const trainingData = await new Promise<any[]>((resolve, reject) => {
                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results: any) => resolve(results.data),
                    error: (err: any) => reject(new Error(`CSV Error: ${err.message}`))
                });
            });
            updateStepStatus('parse', 'completed');
            addLog(`Intelligence Source mapped: ${trainingData.length} records.`);

            // 4. Local Training in Web Worker (Thick Computation)
            updateStepStatus('training', 'active');

            if (workerRef.current) workerRef.current.terminate();
            workerRef.current = new Worker('/fl-worker.js');

            const updatedWeights = await new Promise<ArrayBuffer>((resolve, reject) => {
                workerRef.current!.onmessage = (e) => {
                    const { type, message, progress: p, updatedBuffer } = e.data;
                    if (type === 'STATUS') addLog(message);
                    if (type === 'PROGRESS') setProgress(p);
                    if (type === 'LOG') addLog(message);
                    if (type === 'COMPLETE') resolve(updatedBuffer);
                    if (type === 'ERROR') reject(new Error(message));
                };

                workerRef.current!.postMessage({
                    modelBuffer,
                    trainingData,
                    epochs: 5
                }, [modelBuffer]);
            });

            updateStepStatus('training', 'completed');
            addLog("CPU compute finished. Weights recalculated.");

            // 5. Upload Update
            updateStepStatus('upload', 'active');
            const upRes = await uploadTrainedUpdate(
                'exp1',
                client_id,
                parentVersion,
                updatedWeights
            );

            if (upRes.status === 'rejected') {
                updateStepStatus('upload', 'error');
                setError("Aggregator Rejected the weights (Insufficient L2 Norm change)");
                addLog("CRITICAL: Aggregator Rejected update.");
            } else {
                updateStepStatus('upload', 'completed');
                addLog("Aggregator Accepted update.");
            }

            setResult(upRes);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Pipeline interrupted");
            // Mark failing step
            setSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'error' } : s));
        } finally {
            setIsRunning(false);
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Header / Nav */}
            <header className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 backdrop-blur-3xl transition-all">
                    <ChevronLeft size={16} className="text-white/40 group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Terminal</span>
                </Link>

                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Network Node</span>
                        <span className="text-[10px] font-bold text-emerald-400">REMOTE_GCP_UP</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="flex flex-col">
                    <section className="mb-12">
                        <h1 className="text-6xl font-black tracking-tighter mb-4 leading-[0.9]">
                            Local <span className="text-indigo-500">Compute.</span>
                        </h1>
                        <p className="text-white/30 font-medium max-w-sm">
                            Executing federated protocol on local CPU (Wasm).
                            No data leaves this browser.
                        </p>
                    </section>

                    <div className="space-y-6 max-w-md">
                        {/* File Action */}
                        <div
                            onClick={() => !isRunning && fileInputRef.current?.click()}
                            className={cn(
                                "relative border border-white/10 rounded-4xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center group overflow-hidden",
                                isRunning ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 hover:border-white/20",
                                file ? "bg-indigo-500/5 border-indigo-500/20" : ""
                            )}
                        >
                            {/* Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />

                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div className={cn(
                                "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500",
                                file ? "bg-indigo-500 text-black shadow-lg shadow-indigo-500/20 rotate-0" : "bg-white/5 text-white/40 -rotate-6"
                            )}>
                                <Upload size={28} strokeWidth={2.5} />
                            </div>

                            <h3 className="font-bold text-xl mb-1">{file ? file.name : "Dataset Source"}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB Loaded` : "CSV REQUIRED"}
                            </p>
                        </div>

                        {/* Execute Button */}
                        <button
                            onClick={startTraining}
                            disabled={!file || isRunning}
                            className={cn(
                                "w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all",
                                !file || isRunning ? "bg-white/5 text-white/10" : "bg-white text-black hover:scale-[1.03] active:scale-95 shadow-2xl shadow-white/10"
                            )}
                        >
                            {isRunning ? (
                                <><Zap size={16} fill="currentColor" className="animate-spin" /> RUNNING PIPELINE</>
                            ) : (
                                <><Play size={16} fill="currentColor" /> START FEDERATED CYCLE</>
                            )}
                        </button>

                        {/* Logs Terminal */}
                        <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 font-mono relative overflow-hidden">
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/2 to-transparent h-[200%] animate-[scan_8s_linear_infinite] pointer-events-none" />

                            <div className="flex items-center gap-2 mb-4">
                                <Terminal size={12} className="text-white/20" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Protocol_Telemetry</span>
                            </div>
                            <div className="space-y-2.5 relative z-10">
                                {logs.length === 0 ? (
                                    <div className="text-[10px] text-white/5">{'>'} [System] Kernel Idle. Ready for payload.</div>
                                ) : (
                                    logs.map((log, i) => (
                                        <div key={i} className={cn(
                                            "text-[10px] leading-relaxed",
                                            i === logs.length - 1 ? "text-indigo-400" : "text-white/20"
                                        )}>
                                            <span className="opacity-10 mr-2">{'>'}</span> {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Status */}
                <div className="flex flex-col gap-8">
                    <FLProgress
                        steps={steps}
                        currentProgress={progress}
                        downloadInfo={isRunning && steps[1].status === 'active' ? downloadInfo : undefined}
                        error={error}
                    />

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={cn(
                                    "border rounded-[2.5rem] p-10 backdrop-blur-3xl",
                                    result.status === 'rejected' ? "bg-rose-500/5 border-rose-500/20" : "bg-emerald-500/5 border-emerald-500/20"
                                )}
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-black",
                                        result.status === 'rejected' ? "bg-rose-500" : "bg-emerald-500"
                                    )}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Aggregator Response</h3>
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            result.status === 'rejected' ? "text-rose-500" : "text-emerald-500"
                                        )}>
                                            {result.status === 'rejected' ? "Update Policy Violation" : "Receipt Confirmed"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 font-mono">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">Status</span>
                                        <span className={cn(
                                            "text-xs font-bold uppercase",
                                            result.status === 'rejected' ? "text-rose-500" : "text-emerald-500"
                                        )}>{result.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">Queue_ID</span>
                                        <span className="text-xs font-bold text-white/80">{result.queued_update_id}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">Magnitude (L2 Norm)</span>
                                        <span className={cn(
                                            "text-xs font-bold",
                                            result.status === 'rejected' ? "text-rose-500" : "text-emerald-500"
                                        )}>{result.l2_norm.toFixed(8)}</span>
                                    </div>
                                </div>

                                {result.status === 'rejected' && (
                                    <div className="mt-8 pt-6 border-t border-rose-500/10 flex items-start gap-3">
                                        <AlertCircle size={14} className="text-rose-500 mt-0.5" />
                                        <p className="text-[10px] text-rose-500/60 leading-relaxed italic">
                                            The central hub rejected this update because the weight change was statistically negligible. Ensure your CSV dataset contains meaningful variance.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
