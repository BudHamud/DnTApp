import React from 'react';
import Modal from './Modal';

interface LegacyMigrationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDecline: () => void;
    data: {
        ecology: number;
        peace: number;
        healthcare: number;
        prosperity: number;
    } | null;
}

export default function LegacyMigrationModal({ isOpen, onConfirm, onDecline, data }: LegacyMigrationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onDecline} // Treat closing as decline/postpone? Or force? User said "avisarle". Force might be better or strict choice.
            title="LEGACY DATA DETECTED"
            footer={
                <>
                    <button
                        onClick={onDecline}
                        className="px-4 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        Discard Legacy Data
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-[#00f2ff]/20 hover:bg-[#00f2ff]/30 text-[#00f2ff] border border-[#00f2ff]/30 transition-colors text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                    >
                        Import & Sync
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-3xl text-yellow-500">history_edu</span>
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium mb-1">Previous Session Found</p>
                        <p className="text-slate-400 leading-relaxed">
                            We detected progress from the Classic version of Death & Taxes.
                            Would you like to import these statistics into the new system?
                        </p>
                    </div>
                </div>

                {data && (
                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-4 rounded border border-white/5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Ecology</span>
                            <span className={data.ecology >= 0 ? "text-green-400" : "text-red-400"}>{data.ecology}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Peace</span>
                            <span className={data.peace >= 0 ? "text-green-400" : "text-red-400"}>{data.peace}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Healthcare</span>
                            <span className={data.healthcare >= 0 ? "text-green-400" : "text-red-400"}>{data.healthcare}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Prosperity</span>
                            <span className={data.prosperity >= 0 ? "text-green-400" : "text-red-400"}>{data.prosperity}</span>
                        </div>
                    </div>
                )}

                <div className="p-3 bg-[#aa2329]/10 border border-[#aa2329]/20 rounded text-[#aa2329] text-[10px] flex items-center gap-2">
                    <span className="material-icons-round text-sm">info</span>
                    Importing will synchronize both versions to use the new storage system.
                </div>
            </div>
        </Modal>
    );
}
