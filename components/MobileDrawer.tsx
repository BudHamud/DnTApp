import React from 'react';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] glass-panel z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Close button */}
                    <div className="flex justify-end p-4 border-b border-white/10">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
                        >
                            <span className="material-icons-round text-xl">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
