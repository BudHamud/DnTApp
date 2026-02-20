import React from 'react';
import { Character } from '@/lib/types';

interface CandidateCardProps {
    character: Character;
    isSelected: boolean;
    isProcessed: boolean;
    onClick: () => void;
}

const CandidateCard = React.memo(function CandidateCard({ character, isSelected, isProcessed, onClick }: CandidateCardProps) {
    return (
        <div
            onClick={!isProcessed ? onClick : undefined}
            className={`candidate-item flex items-center justify-between px-6 py-4 transition-all duration-200 cursor-pointer ${isSelected ? 'selected' : ''
                } ${isProcessed ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
        >
            <div className="flex flex-col">
                <span className="text-slate-100 font-medium font-[family-name:var(--font-outfit)] tracking-wide">{character.name}</span>
                <span className="text-[10px] text-slate-400 uppercase">
                    Case ID: #{character.ntt_ref?.substring(0, 6) ?? 'UNKNOWN'} • Age: {character.age} • Occupation: {character.job}
                </span>
            </div>
            <div className="flex items-center gap-4">
                {isSelected && (
                    <span className="text-[10px] text-[#aa2329] font-bold uppercase tracking-widest">Selected</span>
                )}
                <span className={`material-icons-round text-sm ${isSelected ? 'text-[#aa2329]' : 'text-slate-600'}`}>
                    chevron_right
                </span>
            </div>
        </div>
    );
});

export default CandidateCard;
