'use client';

import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { executeCode } from '@/lib/api';
import { motion } from 'framer-motion';

interface CodeCellProps {
    id: string;
    notebookId: string;
    content: string;
    output?: any; // Changed to any to handle complex output
    onUpdate: (content: string, output?: any) => void;
}

export default function CodeCell({ id, notebookId, content, output, onUpdate }: CodeCellProps) {
    const [executing, setExecuting] = useState(false);
    const [localContent, setLocalContent] = useState(content);

    const handleRun = async () => {
        setExecuting(true);
        try {
            const res = await executeCode(notebookId, localContent);
            // Construct a structured output object
            const finalOutput = {
                stdout: res.stdout,
                stderr: res.stderr,
                error: res.error,
                plots: res.plots || []
            };
            onUpdate(localContent, finalOutput);
        } catch (error) {
            onUpdate(localContent, { error: `Failed to connect to backend: ${error}` });
        } finally {
            setExecuting(false);
        }
    };

    return (
        <div className="group relative bg-white/3 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/10">
            {/* Header / Toolbar */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/1">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">Py Node</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <button
                    onClick={handleRun}
                    disabled={executing}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/50 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all"
                >
                    {executing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                    {executing ? 'Executing' : 'Run Cell'}
                </button>
            </div>

            {/* Editor */}
            <div className="px-2 py-4 font-mono text-sm min-h-[100px]">
                <Editor
                    value={localContent}
                    onValueChange={(code) => {
                        setLocalContent(code);
                        onUpdate(code, output);
                    }}
                    highlight={(code) => highlight(code, languages.python, 'python')}
                    padding={16}
                    className="outline-none"
                    style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: 14,
                        minHeight: '100px',
                        color: '#fff'
                    }}
                />
            </div>

            {/* Output */}
            {(output || executing) && (
                <div className="px-6 pb-6 mt-2 space-y-4">
                    {/* Execution Display */}
                    <div className="p-6 bg-black rounded-3xl border border-white/5 font-mono text-[12px] whitespace-pre-wrap">
                        {executing ? (
                            <div className="flex items-center gap-3 text-white/30">
                                <Loader2 size={14} className="animate-spin" />
                                <span>Running computation in persistent session...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {output?.stdout && <div className="text-indigo-300">{output.stdout}</div>}
                                {output?.stderr && <div className="text-amber-400 opacity-70 italic">{output.stderr}</div>}
                                {output?.error && (
                                    <div className="text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/10">
                                        <div className="font-bold mb-1 uppercase tracking-tighter text-[10px]">Stack Trace:</div>
                                        {output.error}
                                    </div>
                                )}
                                {!output?.stdout && !output?.stderr && !output?.error && !output?.plots?.length && (
                                    <span className="text-white/10 italic">No output returned</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Visual Outputs (Plots) */}
                    {!executing && output?.plots?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {output.plots.map((plot: string, idx: number) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={idx}
                                    className="bg-white p-4 rounded-4xl shadow-2xl"
                                >
                                    <img src={plot} alt={`Plot ${idx}`} className="w-full h-auto rounded-xl" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
