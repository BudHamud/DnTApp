import React from 'react';
import { Character } from '@/lib/types';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    // Don't render at all if not open (performance optimization)
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 z-40 md:hidden animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Centered Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 md:hidden pointer-events-none">
                <div className="glass-panel rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200 pointer-events-auto">
                    {/* Close button */}
                    <div className="flex justify-end p-3 border-b border-white/10 bg-black/20">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
                        >
                            <span className="material-icons-round text-xl">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto custom-scrollbar max-h-[calc(90vh-4rem)]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
