'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit3, Eye, Trash2 } from 'lucide-react';

interface MarkdownCellProps {
    id: string;
    content: string;
    onUpdate: (content: string) => void;
}

export default function MarkdownCell({ id, content, onUpdate }: MarkdownCellProps) {
    const [isEditing, setIsEditing] = useState(content === "");
    const [localContent, setLocalContent] = useState(content);

    return (
        <div className="group relative bg-transparent border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/1">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-3 bg-white/5 backdrop-blur-md rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                    {isEditing ? <Eye size={16} /> : <Edit3 size={16} />}
                </button>
            </div>

            <div className="p-8">
                {isEditing ? (
                    <textarea
                        className="w-full h-40 bg-transparent text-white border-none outline-none font-sans text-lg leading-relaxed placeholder:text-white/10 resize-none"
                        value={localContent}
                        placeholder="Write protocol notes (Markdown supported)..."
                        onChange={(e) => {
                            setLocalContent(e.target.value);
                            onUpdate(e.target.value);
                        }}
                    />
                ) : (
                    <div
                        onDoubleClick={() => setIsEditing(true)}
                        className="prose prose-invert max-w-none text-white/50 text-lg leading-relaxed font-light tracking-wide cursor-text"
                    >
                        {localContent ? (
                            <ReactMarkdown>{localContent}</ReactMarkdown>
                        ) : (
                            <span className="text-white/10 italic">Double click to add notes...</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
