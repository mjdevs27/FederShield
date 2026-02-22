import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle, HardDriveDownload } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

interface Step {
    id: string;
    label: string;
    status: StepStatus;
}

interface FLProgressProps {
    steps: Step[];
    currentProgress: number;
    downloadInfo?: { loaded: number, total: number };
    error?: string | null;
}

export default function FLProgress({ steps, currentProgress, downloadInfo, error }: FLProgressProps) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-2">Pipeline Execution</h3>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-4 group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                            step.status === 'completed' ? "bg-emerald-500/20 text-emerald-500 scale-100" :
                                step.status === 'active' ? "bg-indigo-500 text-black scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)]" :
                                    step.status === 'error' ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]" :
                                        "bg-white/5 text-white/20"
                        )}>
                            {step.status === 'completed' && <CheckCircle2 size={18} />}
                            {step.status === 'active' && <Loader2 size={18} className="animate-spin" />}
                            {step.status === 'error' && <AlertCircle size={18} />}
                            {step.status === 'pending' && <Circle size={18} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className={cn(
                                    "text-xs font-bold transition-colors uppercase tracking-widest",
                                    step.status === 'completed' ? "text-emerald-500" :
                                        step.status === 'active' ? "text-white" :
                                            step.status === 'error' ? "text-rose-500" :
                                                "text-white/20"
                                )}>
                                    {step.label}
                                </span>

                                {step.status === 'active' && step.id === 'download' && downloadInfo && (
                                    <span className="text-[10px] font-mono text-indigo-400 font-bold flex items-center gap-2">
                                        <HardDriveDownload size={10} />
                                        {formatSize(downloadInfo.loaded)} / {formatSize(downloadInfo.total)}
                                    </span>
                                )}

                                {step.status === 'active' && step.id === 'training' && (
                                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                                        {currentProgress.toFixed(0)}%
                                    </span>
                                )}
                            </div>

                            {step.status === 'active' && (step.id === 'training' || (step.id === 'download' && downloadInfo)) && (
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: step.id === 'download' && downloadInfo && downloadInfo.total
                                                ? `${(downloadInfo.loaded / downloadInfo.total) * 100}%`
                                                : `${currentProgress}%`
                                        }}
                                        className={cn(
                                            "h-full transition-all duration-300",
                                            step.status === 'error' ? "bg-rose-500" : "bg-indigo-500"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-200/70 font-medium leading-relaxed">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
