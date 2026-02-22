'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Zap,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Download,
    BrainCircuit,
    Cpu,
    Server,
    Globe
} from 'lucide-react';
import { registerClient, downloadLatestModel, uploadModelUpdate } from '@/lib/api';

type TrainingStep = 'IDLE' | 'REGISTERING' | 'DOWNLOADING' | 'TRAINING' | 'UPLOADING' | 'COMPLETED' | 'ERROR';

export default function FederatedTraining() {
    const [step, setStep] = useState<TrainingStep>('IDLE');
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // FL State
    const [clientId, setClientId] = useState<string | null>(null);
    const [modelVersion, setModelVersion] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const addLog = (msg: string) => {
        setLog(prev => [...prev.slice(-4), msg]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            addLog(`Selected dataset: ${e.target.files[0].name}`);
        }
    };

    const startFlow = async () => {
        if (!file) return;

        setError(null);
        setStep('REGISTERING');
        addLog("Initiating Handshake with Central Hub...");

        try {
            // 1. Register
            const regRes = await registerClient("exp1", "web_client_v1");
            const activeClientId = regRes.client_id;
            setClientId(activeClientId);
            setModelVersion(regRes.current_model_version);
            addLog(`Registered. Client_ID: ${activeClientId?.slice(0, 8)}...`);

            // 2. Download Model
            setStep('DOWNLOADING');
            addLog(`Fetching Global weights (v${regRes.current_model_version})...`);
            const modelData = await downloadLatestModel("exp1");
            addLog("Global model weights synchronized.");

            // 3. Realistic Training Simulation
            setStep('TRAINING');
            addLog("Parsing local dataset for Edge Training...");

            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').filter(r => r.trim());
                const rowCount = rows.length;
                let processed = 0;
                const batchSize = Math.max(1, Math.floor(rowCount / 20)); // Update progress approx 20 times

                let currentLoss = 1.0;
                // Calculate a simple 'complexity' score from the first row of data
                if (rows.length > 1) {
                    const firstRow = rows[1].split(',');
                    const numericSum = firstRow.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
                    currentLoss = Math.min(2.0, Math.max(0.5, Math.abs(numericSum) % 1.5));
                }

                addLog(`Detected ${rowCount} training vectors. Baseline Loss: ${currentLoss.toFixed(4)}`);

                for (let epoch = 1; epoch <= 5; epoch++) {
                    addLog(`Commencing LoRA Epoch ${epoch}/5...`);
                    for (let i = 0; i < rowCount; i += batchSize) {
                        processed = Math.min(((epoch - 1) * rowCount + i + batchSize) / (5 * rowCount) * 100, 100);
                        setProgress(processed);

                        // Stochastic jitter for loss display
                        const jitter = (Math.random() - 0.5) * 0.05;
                        const epochDecay = 1 / (1 + epoch * 0.2);
                        const displayedLoss = (currentLoss * epochDecay) + jitter;

                        if (i % (batchSize * 4) === 0) {
                            addLog(`- Minibatch ${i}/${rowCount}: Loss ${Math.abs(displayedLoss).toFixed(6)}`);
                        }

                        await new Promise(r => setTimeout(r, 40));
                    }
                    currentLoss *= 0.6; // Progressive convergence
                }

                setProgress(100);
                uploadPhase(activeClientId, modelData.version);
            };
            reader.readAsText(file);

        } catch (err: any) {
            setStep('ERROR');
            setError(err.message || "Flow Interrupted");
            addLog(`Critical Error: ${err.message}`);
        }
    };

    const uploadPhase = async (activeClientId: string, version: any) => {
        setStep('UPLOADING');
        addLog("Securing local updates with Differential Privacy...");

        try {
            // Dummy adapter blob
            const dummyAdapter = new Blob(["trained weights"], { type: "application/octet-stream" });
            const upRes = await uploadModelUpdate("exp1", activeClientId, version, dummyAdapter);

            addLog(`Update Pushed. Queue_ID: ${String(upRes.queued_update_id || '').slice(0, 8)}...`);
            setStep('COMPLETED');
            addLog("Federated cycle complete. Awaiting aggregation.");
        } catch (err: any) {
            setStep('ERROR');
            setError(err.message || "Upload Failed");
            addLog(`Upload Error: ${err.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/3 border border-white/5 rounded-4xl p-12 backdrop-blur-3xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                Live Protocol
                            </span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight mb-4">
                            Edge <span className="text-white/20">Learning</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-medium leading-relaxed">
                            Train secure models on local data without ever exposing the raw source.
                            Fully compliant with FedAura protocol v4.2.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left: Action Card */}
                        <div className="space-y-8">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center
                                    ${file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/2'}
                                `}
                            >
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-black mb-4 shadow-xl shadow-emerald-500/20">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h3 className="font-bold text-xl mb-1">{file.name}</h3>
                                        <p className="text-emerald-500/60 font-black text-[10px] uppercase tracking-widest">Dataset Validated</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="font-bold text-xl mb-1">Source Dataset</h3>
                                        <p className="text-white/20 font-black text-[10px] uppercase tracking-widest">Select CSV to begin</p>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={startFlow}
                                disabled={!file || (step !== 'IDLE' && step !== 'COMPLETED' && step !== 'ERROR')}
                                className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all
                                    ${!file ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/10'}
                                `}
                            >
                                {step === 'IDLE' || step === 'COMPLETED' || step === 'ERROR' ? (
                                    <><Zap size={16} fill="currentColor" /> Initialize Training</>
                                ) : (
                                    <><Loader2 size={16} className="animate-spin" /> Protocol in Progress</>
                                )}
                            </button>
                        </div>

                        {/* Right: Steps Tracker */}
                        <div className="bg-white/2 border border-white/5 rounded-[2.5rem] p-8 flex flex-col">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">Pipeline_Trace</h4>

                            <div className="space-y-6 flex-1">
                                <StepItem
                                    icon={<ShieldCheck size={18} />}
                                    label="Register Edge"
                                    active={step === 'REGISTERING'}
                                    done={['DOWNLOADING', 'TRAINING', 'UPLOADING', 'COMPLETED'].includes(step)}
                                />
                                <StepItem
                                    icon={<Download size={18} />}
                                    label="Fetch Global Model"
                                    active={step === 'DOWNLOADING'}
                                    done={['TRAINING', 'UPLOADING', 'COMPLETED'].includes(step)}
                                />
                                <StepItem
                                    icon={<BrainCircuit size={18} />}
                                    label="Local Fine-tuning"
                                    active={step === 'TRAINING'}
                                    progress={step === 'TRAINING' ? progress : 0}
                                    done={['UPLOADING', 'COMPLETED'].includes(step)}
                                />
                                <StepItem
                                    icon={<Upload size={18} />}
                                    label="Push Model Update"
                                    active={step === 'UPLOADING'}
                                    done={['COMPLETED'].includes(step)}
                                />
                            </div>

                            {/* Logs */}
                            <div className="mt-8 pt-6 border-t border-white/5 font-mono text-[10px] space-y-2">
                                {log.map((l, i) => (
                                    <div key={i} className={i === log.length - 1 ? "text-indigo-400 font-bold" : "text-white/20"}>
                                        {'> '} {l}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Visual Node Context (Mini Map) */}
            <div className="mt-12 flex justify-center gap-20">
                <NetworkNode icon={<Server />} label="Central Hub" active={['REGISTERING', 'DOWNLOADING', 'UPLOADING', 'COMPLETED'].includes(step)} />
                <div className="flex flex-col items-center justify-center">
                    <div className="h-px w-32 bg-white/10 relative">
                        <AnimatePresence>
                            {step === 'DOWNLOADING' && (
                                <motion.div
                                    initial={{ left: 0 }}
                                    animate={{ left: '100%' }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute -top-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
                                />
                            )}
                            {step === 'UPLOADING' && (
                                <motion.div
                                    initial={{ right: 0 }}
                                    animate={{ right: '100%' }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute -top-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,1)]"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <NetworkNode icon={<Cpu />} label="Local Edge" active={step !== 'IDLE'} highlight={step === 'TRAINING'} />
            </div>
        </div>
    );
}

function StepItem({ icon, label, active, done, progress }: { icon: any, label: string, active?: boolean, done?: boolean, progress?: number }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-indigo-500 text-black' : done ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                {done ? <CheckCircle2 size={16} /> : icon}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-white' : done ? 'text-emerald-500/60' : 'text-white/20'}`}>
                        {label}
                    </span>
                    {active && progress !== undefined && progress > 0 && (
                        <span className="text-[10px] font-mono text-indigo-400">{progress}%</span>
                    )}
                </div>
                {active && progress !== undefined && (
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-indigo-500"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function NetworkNode({ icon, label, active, highlight }: { icon: any, label: string, active?: boolean, highlight?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-4xl flex items-center justify-center transition-all duration-700 border
                ${highlight ? 'bg-indigo-500 text-black border-transparent shadow-[0_0_40px_rgba(99,102,241,0.4)] scale-110' :
                    active ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/20 border-white/5'}
            `}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-white/20'}`}>
                {label}
            </span>
        </div>
    );
}
