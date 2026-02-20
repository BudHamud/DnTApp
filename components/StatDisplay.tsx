import React from 'react';


interface StatDisplayProps {
    label: string;
    value: number;
    imagePath: string;
    iconName?: string;
}

export default function StatDisplay({ label, value, imagePath, iconName }: StatDisplayProps) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const getStatColor = (val: number): string => {
        if (val > 0) return 'text-green-400';
        if (val < 0) return 'text-red-400';
        return 'text-slate-100';
    };

    return (
        <div className="flex items-center space-x-3 group cursor-default">
            {imagePath ? (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src={`${basePath}${imagePath}`}
                        alt={label}
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : iconName ? (
                <span className="material-icons-round text-green-400">{iconName}</span>
            ) : null}
            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
                <p className={`text-xl font-[family-name:var(--font-outfit)] font-bold leading-none ${getStatColor(value)}`}>
                    {value > 0 ? '+' : ''}{value}
                </p>
            </div>
        </div>
    );
}
