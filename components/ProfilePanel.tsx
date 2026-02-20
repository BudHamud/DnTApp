import React from 'react';

import { Character } from '@/lib/types';

interface ProfilePanelProps {
    character: Character | null;
    onSpare: () => void;
    onDeath: () => void;
    isMobile?: boolean;
}

export default function ProfilePanel({ character, onSpare, onDeath, isMobile = false }: ProfilePanelProps) {
    if (!character) {
        if (isMobile) return null; // Don't show empty state in mobile modal

        return (
            <aside className="w-80 flex flex-col gap-6 shrink-0">
                <div className="glass-panel rounded-xl overflow-hidden flex flex-col p-6 border-[#00f2ff]/30">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold text-[#00f2ff] uppercase tracking-widest">Active Profile</span>
                        <span className="material-symbols-outlined text-[#00f2ff]">contact_page</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                        <div className="text-6xl mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>person</span>
                        </div>
                        <p className="text-sm">SELECT A SUBJECT TO BEGIN ANALYSIS</p>
                    </div>
                </div>
            </aside>
        );
    }

    const Container = isMobile ? 'div' : 'aside';
    const containerClasses = isMobile ? 'w-full' : 'w-80 flex flex-col gap-6 shrink-0';
    // On mobile, remove glass-panel and border, but keep padding and layout
    const innerClasses = isMobile
        ? 'flex flex-col p-6'
        : 'glass-panel rounded-xl overflow-hidden flex flex-col p-6 border-[#00f2ff]/30';

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    return (
        <Container className={containerClasses}>
            <div className={innerClasses}>
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-[#00f2ff] uppercase tracking-widest">Active Profile</span>
                    <span className="material-symbols-outlined text-[#00f2ff]">contact_page</span>
                </div>

                {/* Avatar and Name */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-[family-name:var(--font-outfit)] font-bold">{character.name}</h3>
                    <p className="text-xs text-slate-500">{character.job} • {character.age} Years Old</p>
                </div>

                {/* Bio */}
                <div className="space-y-4 mb-6">
                    <div className="bg-black/20 p-3 rounded border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Impact Analysis</p>
                        <p className="text-xs text-slate-300 italic">"{character.bio || "No biographical data available for this subject."}"</p>
                    </div>
                </div>

                {/* 4 Stats with Images */}
                <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Statistical Impact</p>
                    <div className="bg-black/20 rounded-lg overflow-hidden border border-white/5">
                        <div className="grid grid-cols-3 gap-2 p-2 border-b border-white/5 bg-white/5">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Metrics</div>
                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest text-center">if Spared</div>
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest text-center">if Executed</div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {[
                                { label: 'Ecology', img: '/img/ecology.svg', spare: character.spare_ecology, death: character.death_ecology, iconClass: 'w-7 h-7' },
                                { label: 'Peace', img: '/img/peace.svg', spare: character.spare_peace, death: character.death_peace, iconClass: 'w-7 h-7' },
                                { label: 'Healthcare', img: '/img/healthcare.svg', spare: character.spare_healthcare, death: character.death_healthcare, iconClass: 'w-8 h-8' },
                                { label: 'Prosperity', img: '/img/prosperity.svg', spare: character.spare_prosperity, death: character.death_prosperity, iconClass: 'w-8 h-8' }
                            ].map((stat) => (
                                <div key={stat.label} className="grid grid-cols-3 gap-2 p-2 items-center hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-2 pl-1">
                                        <div className="w-10 h-10 flex items-center justify-center relative">
                                            <div className={`relative ${stat.iconClass} opacity-90`}>
                                                <img
                                                    src={`${basePath}${stat.img}`}
                                                    alt={stat.label}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{stat.label}</span>
                                    </div>
                                    <div className={`text-center font-mono font-bold text-sm ${stat.spare > 0 ? 'text-green-400' : stat.spare < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                        {stat.spare > 0 ? '+' : ''}{stat.spare}
                                    </div>
                                    <div className={`text-center font-mono font-bold text-sm ${stat.death > 0 ? 'text-green-400' : stat.death < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                        {stat.death > 0 ? '+' : ''}{stat.death}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decision Buttons */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Final Judgment</p>
                    <button
                        onClick={onSpare}
                        className="btn-spare w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                    >
                        <div className="w-6 h-6 relative">
                            <img src={`${basePath}/img/live.svg`} alt="Spare" className="w-full h-full object-contain" />
                        </div>
                        <span>SPARE LIFE</span>
                    </button>
                    <button
                        onClick={onDeath}
                        className="btn-death w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                    >
                        <div className="w-6 h-6 relative">
                            <img src={`${basePath}/img/die.svg`} alt="Death" className="w-full h-full object-contain" />
                        </div>
                        <span>MARK FOR DEATH</span>
                    </button>
                </div>
            </div>
        </Container>
    );
}
