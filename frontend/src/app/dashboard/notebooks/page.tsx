'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchNotebooks, createNotebook, deleteNotebook } from '@/lib/api';
import { Plus, Book, Trash2, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotebooksPage() {
    const [notebooks, setNotebooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotebooks();
    }, []);

    async function loadNotebooks() {
        try {
            const data = await fetchNotebooks();
            setNotebooks(data);
        } catch (error) {
            console.error("Failed to load notebooks:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate() {
        const name = prompt("Enter notebook name:");
        if (name) {
            await createNotebook(name);
            loadNotebooks();
        }
    }

    async function handleDelete(id: string, e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Delete this notebook?")) {
            await deleteNotebook(id);
            loadNotebooks();
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-[-0.04em] mb-4">
                            Notebook <span className="text-white/40 font-extralight">Manager</span>
                        </h1>
                        <p className="text-white/40 font-light tracking-wide">
                            Manage your private AI training protocols and analysis.
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-white/10"
                    >
                        <Plus size={18} />
                        New Notebook
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {notebooks.length === 0 ? (
                            <div className="col-span-full py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center">
                                <p className="text-white/20 uppercase tracking-[0.3em] text-xs font-bold">No notebooks found</p>
                            </div>
                        ) : (
                            notebooks.map((nb) => (
                                <Link key={nb.id} href={`/dashboard/notebooks/${nb.id}`}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleDelete(nb.id, e)}
                                                className="text-white/20 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <Book size={24} />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">{nb.name}</h3>

                                        <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} />
                                                {new Date(nb.updated_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                                                {nb.cells?.length || 0} Cells
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                            Open Protocol
                                            <ChevronRight size={14} />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
