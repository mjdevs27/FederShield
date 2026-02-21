'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNotebook, updateNotebook, restartKernel } from '@/lib/api';
import CodeCell from '@/components/notebook/CodeCell';
import MarkdownCell from '@/components/notebook/MarkdownCell';
import { ChevronLeft, Plus, Save, Trash, MoveUp, MoveDown, Terminal, FileText, ChevronRight, RefreshCw, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotebookEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const [notebook, setNotebook] = useState<any>(null);
    const [cells, setCells] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            loadNotebook();
        }
    }, [id]);

    // Autosave functionality
    useEffect(() => {
        if (!notebook || cells.length === 0) return;

        const delayDebounceFn = setTimeout(() => {
            handleSave();
        }, 2000); // 2 second debounce

        return () => clearTimeout(delayDebounceFn);
    }, [cells]);

    async function loadNotebook() {
        const data = await fetchNotebook(id as string);
        setNotebook(data);
        setCells(data.cells || []);
    }

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateNotebook(id as string, {
                name: notebook.name,
                cells: cells
            });
        } catch (error) {
            console.error("Autosave failed:", error);
        } finally {
            setSaving(false);
        }
    };

    const addCell = (type: 'code' | 'markdown', index?: number) => {
        const newCell = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: "",
            output: ""
        };

        if (typeof index === 'number') {
            const newCells = [...cells];
            newCells.splice(index, 0, newCell);
            setCells(newCells);
        } else {
            setCells([...cells, newCell]);
        }
    };

    const updateCell = (cellId: string, content: string, output?: any) => {
        setCells(prev => prev.map(c =>
            c.id === cellId ? { ...c, content, output: output !== undefined ? output : c.output } : c
        ));
    };

    const removeCell = (cellId: string) => {
        setCells(prev => prev.filter(c => c.id !== cellId));
    };

    const moveCell = (index: number, direction: 'up' | 'down') => {
        const newCells = [...cells];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newCells.length) return;

        const [movedCell] = newCells.splice(index, 1);
        newCells.splice(targetIndex, 0, movedCell);
        setCells(newCells);
    };

    const handleRestart = async () => {
        if (confirm("Restart current runtime? Variables and imports will be cleared.")) {
            await restartKernel(id as string);
            alert("Kernel restarted.");
        }
    };

    const handleClearOutputs = () => {
        setCells(prev => prev.map(c => ({ ...c, output: "" })));
    };

    if (!notebook) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 py-6 px-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.push('/dashboard/notebooks')}
                            className="bg-white/5 p-3 rounded-2xl text-white/40 hover:text-white transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Notebook API</span>
                                <ChevronRight size={10} className="text-white/20" />
                            </div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tight">{notebook.name}</h1>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${saving ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-40'}`}>
                                    <div className={`w-1 h-1 rounded-full ${saving ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                    {saving ? 'Syncing...' : 'Synced'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <RefreshCw size={14} />
                            Restart
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-white text-black px-10 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center gap-2"
                        >
                            {saving ? <Plus size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Sub-header for clear outputs */}
            {cells.length > 0 && (
                <div className="max-w-4xl mx-auto px-6 mt-8 flex justify-end">
                    <button
                        onClick={handleClearOutputs}
                        className="flex items-center gap-2 text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                        <Eraser size={12} />
                        Clear All Outputs
                    </button>
                </div>
            )}

            <main className="max-w-4xl mx-auto py-10 px-6">
                <AnimatePresence mode="popLayout">
                    {cells.length === 0 ? (
                        <div className="py-40 text-center bg-white/1 border border-dashed border-white/5 rounded-[4rem]">
                            <p className="text-white/10 uppercase tracking-[0.5em] text-xs font-black">No compute nodes defined</p>
                            <div className="mt-8 flex justify-center gap-4">
                                <button onClick={() => addCell('code')} className="text-indigo-400 hover:text-indigo-300 font-bold text-[10px] tracking-widest uppercase">+ Add Logic</button>
                                <button onClick={() => addCell('markdown')} className="text-white/20 hover:text-white/40 font-bold text-[10px] tracking-widest uppercase">+ Add Docs</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cells.map((cell, index) => (
                                <React.Fragment key={cell.id}>
                                    {/* Insert Point Above */}
                                    <div className="group/insert relative h-4 flex items-center justify-center">
                                        <div className="w-full h-px bg-white/5 group-hover/insert:bg-indigo-500/20 transition-colors"></div>
                                        <div className="absolute opacity-0 group-hover/insert:opacity-100 flex gap-2 bg-[#050505] px-4 transition-all scale-90 group-hover/insert:scale-100">
                                            <button onClick={() => addCell('code', index)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-white/5">
                                                <Terminal size={12} /> + Code
                                            </button>
                                            <button onClick={() => addCell('markdown', index)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                                                <FileText size={12} /> + Text
                                            </button>
                                        </div>
                                    </div>

                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group"
                                    >
                                        {/* Cell Controls */}
                                        <div className="absolute -left-16 top-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => moveCell(index, 'up')} className="p-2 text-white/10 hover:text-white transition-colors"><MoveUp size={16} /></button>
                                            <button onClick={() => moveCell(index, 'down')} className="p-2 text-white/10 hover:text-white transition-colors"><MoveDown size={16} /></button>
                                            <button onClick={() => removeCell(cell.id)} className="p-2 text-white/10 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                                        </div>

                                        {cell.type === 'code' ? (
                                            <CodeCell
                                                id={cell.id}
                                                notebookId={id as string}
                                                content={cell.content}
                                                output={cell.output}
                                                onUpdate={(content, output) => updateCell(cell.id, content, output)}
                                            />
                                        ) : (
                                            <MarkdownCell
                                                id={cell.id}
                                                content={cell.content}
                                                onUpdate={(content) => updateCell(cell.id, content)}
                                            />
                                        )}
                                    </motion.div>

                                    {/* Final Insert Point at the very bottom of the last cell */}
                                    {index === cells.length - 1 && (
                                        <div className="group/insert relative h-12 flex items-center justify-center mt-4">
                                            <div className="w-full h-px bg-white/5 group-hover/insert:bg-indigo-500/20 transition-colors"></div>
                                            <div className="absolute opacity-0 group-hover/insert:opacity-100 flex gap-2 bg-[#050505] px-4 transition-all">
                                                <button onClick={() => addCell('code')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-white/5">
                                                    <Terminal size={12} /> + Code
                                                </button>
                                                <button onClick={() => addCell('markdown')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                                                    <FileText size={12} /> + Text
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
