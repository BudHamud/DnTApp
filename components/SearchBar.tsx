import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative group">
            <input
                className="w-full bg-black/40 border-2 border-transparent focus:border-[#00f2ff] transition-all duration-300 rounded-lg py-3 px-11 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                placeholder="Search candidates..."
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00f2ff] transition-colors">search</span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400">K</kbd>
            </div>
        </div>
    );
}
