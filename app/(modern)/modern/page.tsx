'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Character } from '@/lib/types';
import { fetchCharacters, searchCharacters, sortCharacters } from '@/lib/data';
import { useGame } from '@/context/GameContext';
import DecisionLogItem from '@/components/DecisionLogItem';
import StatDisplay from '@/components/StatDisplay';
import SearchBar from '@/components/SearchBar';
import CandidateCard from '@/components/CandidateCard';
import ProfilePanel from '@/components/ProfilePanel';
import Modal from '@/components/Modal';
import MobileDrawer from '@/components/MobileDrawer';
import BottomSheet from '@/components/BottomSheet';
import LegacyMigrationModal from '@/components/LegacyMigrationModal';

export default function Home() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'age' | 'job'>('name');
    const [showResetModal, setShowResetModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showMobileDrawer, setShowMobileDrawer] = useState(false);
    const [showMobileProfile, setShowMobileProfile] = useState(false);
    const [showMigrationModal, setShowMigrationModal] = useState(false);
    const [legacyData, setLegacyData] = useState<{ ecology: number, peace: number, healthcare: number, prosperity: number } | null>(null);

    const { history, makeDecision, stats, resetStats, clearHistory, fullReset, updateStats } = useGame();

    // Check for "legacy" data on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if Modern V2 data ALREADY exists
            const modernDataExists = localStorage.getItem("dnt_stats") !== null;

            // Check if Legacy keys exist
            const eco = localStorage.getItem('ecology');
            const pea = localStorage.getItem('peace');
            const hea = localStorage.getItem('healthcare');
            const pro = localStorage.getItem('prosperity');
            const legacyExists = eco !== null || pea !== null || hea !== null || pro !== null;

            // Only show migration if Legacy exists AND Modern is missing
            // If Modern exists, we assume data is already migrated or synced via V1's new logic
            if (legacyExists && !modernDataExists) {
                setLegacyData({
                    ecology: Number(eco) || 0,
                    peace: Number(pea) || 0,
                    healthcare: Number(hea) || 0,
                    prosperity: Number(pro) || 0
                });
                setShowMigrationModal(true);
            }
        }
    }, []);

    const handleMigrationConfirm = () => {
        if (legacyData) {
            // Update stats with legacy data
            // We replace current stats with legacy stats to be consistent with "continuing"
            // Or we could add? "Same array" implies synchronization.
            // It's safer to SET them.
            updateStats(legacyData);

            // Clear legacy keys
            localStorage.removeItem('ecology');
            localStorage.removeItem('peace');
            localStorage.removeItem('healthcare');
            localStorage.removeItem('prosperity');

            setShowMigrationModal(false);
        }
    };

    const handleMigrationDecline = () => {
        // User chose NOT to import. We should probably clear them so we don't ask again?
        // "que los otros datos se borren así no se vuelven a detectar"
        localStorage.removeItem('ecology');
        localStorage.removeItem('peace');
        localStorage.removeItem('healthcare');
        localStorage.removeItem('prosperity');
        setShowMigrationModal(false);
    };

    // Load characters on mount
    useEffect(() => {
        const loadCharacters = async () => {
            setLoading(true);
            const data = await fetchCharacters();
            setCharacters(data);
            setLoading(false);
        };
        loadCharacters();
    }, []);

    // Memoize filtered and sorted characters to prevent unnecessary recalculations
    const filteredCharacters = useMemo(() => {
        let result = searchCharacters(characters, searchQuery);
        result = sortCharacters(result, sortBy);
        return result;
    }, [searchQuery, characters, sortBy]);

    // Set de personajes ya procesados para evitar múltiples búsquedas lineales
    const processedCharacterRefs = useMemo(() => {
        return new Set(history.map((h) => h.characterRef));
    }, [history]);

    const availableCandidatesCount = useMemo(() => {
        return filteredCharacters.filter((char) => !processedCharacterRefs.has(char.ntt_ref)).length;
    }, [filteredCharacters, processedCharacterRefs]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handleDecision = (type: 'spare' | 'death') => {
        if (selectedCharacter) {
            makeDecision(selectedCharacter, type);
            setSelectedCharacter(null); // Clear selection after decision
            setShowMobileProfile(false); // Close mobile bottom sheet
        }
    };

    const handleCandidateSelect = (char: Character) => {
        setSelectedCharacter(char);
        setShowMobileProfile(true); // Open bottom sheet on mobile
    };

    const handleFullReset = () => {
        fullReset();
        setSelectedCharacter(null);
        setShowMobileProfile(false);
        setShowMobileDrawer(false);
        setShowSettingsModal(false);
        setShowResetModal(false);
    };

    return (
        <>
            <div className="bg-burgundy-grain"></div>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 glass-panel z-30 border-b border-white/10">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => setShowMobileDrawer(true)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
                    >
                        <span className="material-icons-round">menu</span>
                    </button>
                    <h1 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Death & Taxes</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
                        >
                            <span className="material-icons-round text-sm">settings</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex h-screen w-full md:p-6 gap-6 max-w-[1600px] mx-auto pt-16 md:pt-0">
                {/* Left Sidebar - Decision Log (solo en pantallas muy grandes) */}
                <aside className="hidden xl:flex w-72 flex-col glass-panel rounded-xl overflow-hidden shrink-0">
                    <div className="p-5 border-b border-white/10 bg-black/20">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase flex items-center">
                            <span className="material-symbols-outlined text-sm mr-2 text-[#aa2329]">history</span>
                            Decision Log
                        </h2>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        <div className="divide-y divide-white/5">
                            {history.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 text-xs">NO RECORDS FOUND</div>
                            ) : (
                                history.slice().reverse().map((decision, index) => (
                                    <DecisionLogItem
                                        key={index}
                                        name={decision.character}
                                        caseId={(1000 + index).toString()}
                                        type={decision.type}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="p-3 bg-black/40 border-t border-white/10 text-center">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Total Decisions: {history.length}</span>
                    </div>
                </aside>

                {/* Center Panel - Candidate List */}
                {/* Main Panel */}
                <main className="flex-grow flex flex-col glass-panel md:rounded-xl overflow-hidden shadow-2xl border-white/20">
                    <div className="p-6 border-b border-white/10 bg-black/10">
                        <div className="flex justify-between items-start mb-6">
                            {/* Stats más responsivas: 2 columnas en pantallas medianas, 4 solo en pantallas grandes */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 xl:gap-8 flex-grow justify-items-center">
                                <StatDisplay label="Ecology" value={stats.ecology} imagePath="/img/ecology.svg" iconName="" />
                                <StatDisplay label="Peace" value={stats.peace} imagePath="/img/peace.svg" iconName="" />
                                <StatDisplay label="Healthcare" value={stats.healthcare} imagePath="/img/healthcare.svg" iconName="" />
                                <StatDisplay label="Prosperity" value={stats.prosperity} imagePath="/img/prosperity.svg" iconName="" />
                            </div>
                            <div className="hidden md:flex space-x-2 ml-4">
                                {/* Botón para ver Decision Log en tamaños donde el sidebar está oculto (md–lg) */}
                                <button
                                    onClick={() => setShowMobileDrawer(true)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300 xl:hidden"
                                    title="Open Decision Log"
                                >
                                    <span className="material-symbols-outlined text-sm">history</span>
                                </button>
                                <button
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
                                    title="Settings"
                                    onClick={() => setShowSettingsModal(true)}
                                >
                                    <span className="material-icons-round text-sm">settings</span>
                                </button>
                            </div>
                        </div>
                        <SearchBar value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div className="bg-[#aa2329]/10 border-b border-[#aa2329]/20 px-6 py-2">
                        <p className="text-xs font-semibold text-[#aa2329] uppercase tracking-[0.2em] text-center">
                            Active Session:{" "}
                            <span className="text-slate-200 ml-1 italic capitalize">
                                {availableCandidatesCount} Available Candidates
                            </span>
                        </p>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar bg-black/20">
                        <div className="divide-y divide-white/5">
                            {loading ? (
                                <div className="text-center py-20 text-slate-400 animate-pulse">Initializing Data Stream...</div>
                            ) : filteredCharacters.length === 0 && searchQuery === '' ? (
                                <div className="text-center py-20 text-red-400">
                                    <p className="font-bold">SYSTEM ERROR: NO CANDIDATE DATA</p>
                                    <p className="text-xs">Database Connection Failed. Check console logs.</p>
                                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-900/50 rounded hover:bg-red-800 transition-colors text-xs uppercase">Retry Retrieval</button>
                                </div>
                            ) : (
                                filteredCharacters.map((char, index) => {
                                    const isProcessed = processedCharacterRefs.has(char.ntt_ref);
                                    return (
                                        <CandidateCard
                                            key={`${char.ntt_ref}-${index}`}
                                            character={char}
                                            isSelected={selectedCharacter?.ntt_ref === char.ntt_ref}
                                            isProcessed={isProcessed}
                                            onClick={() => !isProcessed && handleCandidateSelect(char)}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                    {/* <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] mr-2 animate-pulse"></span>
              System Stable
            </div>
            <div>V2.0</div>
          </div> */}
                </main>

                {/* Desktop Profile Panel - visible en pantallas ≥768px, oculto solo en mobile */}
                <div className="hidden md:block">
                    <ProfilePanel
                        character={selectedCharacter}
                        onSpare={() => handleDecision('spare')}
                        onDeath={() => handleDecision('death')}
                    />
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="SYSTEM RESET REQUIRED"
                footer={
                    <>
                        <button
                            onClick={() => setShowResetModal(false)}
                            className="px-4 py-2 rounded text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFullReset}
                            className="px-4 py-2 rounded bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800 hover:border-red-500 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            Confirm Reset
                        </button>
                    </>
                }
            >
                <div className="flex items-start gap-4">
                    <span className="material-icons-round text-4xl text-red-500">warning</span>
                    <div>
                        <p className="mb-2 font-bold text-red-400">WARNING: IRREVERSIBLE ACTION</p>
                        <p>This will erase all decision history and reset statistical impact data. The current timeline will be lost.</p>
                        <p className="mt-2 text-xs text-slate-500">Are you sure you want to proceed?</p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                title="SYSTEM CONFIGURATION"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-black/20 rounded border border-white/5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Override Statistics</h4>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                <label className="text-[10px] text-green-400 uppercase font-bold block mb-1">Ecology</label>
                                <input
                                    type="number"
                                    className="w-full bg-transparent text-right text-slate-200 text-sm font-mono focus:outline-none"
                                    value={stats.ecology}
                                    onChange={(e) => updateStats({ ecology: Number(e.target.value) })}
                                />
                            </div>
                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                <label className="text-[10px] text-yellow-400 uppercase font-bold block mb-1">Peace</label>
                                <input
                                    type="number"
                                    className="w-full bg-transparent text-right text-slate-200 text-sm font-mono focus:outline-none"
                                    value={stats.peace}
                                    onChange={(e) => updateStats({ peace: Number(e.target.value) })}
                                />
                            </div>
                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                <label className="text-[10px] text-blue-400 uppercase font-bold block mb-1">Healthcare</label>
                                <input
                                    type="number"
                                    className="w-full bg-transparent text-right text-slate-200 text-sm font-mono focus:outline-none"
                                    value={stats.healthcare}
                                    onChange={(e) => updateStats({ healthcare: Number(e.target.value) })}
                                />
                            </div>
                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                <label className="text-[10px] text-purple-400 uppercase font-bold block mb-1">Prosperity</label>
                                <input
                                    type="number"
                                    className="w-full bg-transparent text-right text-slate-200 text-sm font-mono focus:outline-none"
                                    value={stats.prosperity}
                                    onChange={(e) => updateStats({ prosperity: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-600 italic text-center mt-2">Adjusting these values directly impacts game balance.</p>
                    </div>

                    <div className="p-3 bg-black/20 rounded border border-white/5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">System Reset</h4>
                        <p className="text-[10px] text-slate-500">
                            Clears all decision history, favorites and resets statistics. This action is irreversible.
                        </p>
                        <button
                            onClick={() => {
                                setShowSettingsModal(false);
                                setShowResetModal(true);
                            }}
                            className="w-full px-4 py-2 rounded bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-800/60 hover:border-red-500/70 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                            Full Reset
                        </button>
                    </div>

                    <div className="pt-2">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-full p-3 rounded-lg bg-[#aa2329]/10 hover:bg-[#aa2329]/20 text-[#aa2329] border border-[#aa2329]/20 transition-colors text-xs font-bold uppercase tracking-wider gap-2"
                        >
                            <span className="material-icons-round text-lg">history</span>
                            Switch to Classic Mode
                        </Link>
                    </div>
                </div>
            </Modal>

            {/* Mobile Drawer - Decision Log */}
            <MobileDrawer isOpen={showMobileDrawer} onClose={() => setShowMobileDrawer(false)}>
                <div className="p-5 border-b border-white/10 bg-black/20">
                    <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase flex items-center">
                        <span className="material-symbols-outlined text-sm mr-2 text-[#aa2329]">history</span>
                        Decision Log
                    </h2>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-white/5">
                        {history.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 text-xs">NO RECORDS FOUND</div>
                        ) : (
                            history.slice().reverse().map((decision, index) => (
                                <DecisionLogItem
                                    key={index}
                                    name={decision.character}
                                    caseId={(1000 + index).toString()}
                                    type={decision.type}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className="p-3 bg-black/40 border-t border-white/10 text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Total Decisions: {history.length}</span>
                </div>
            </MobileDrawer>


            {/* Mobile Bottom Sheet - Profile Panel */}
            <BottomSheet isOpen={showMobileProfile} onClose={() => setShowMobileProfile(false)}>
                {selectedCharacter && (
                    <ProfilePanel
                        character={selectedCharacter}
                        onSpare={() => handleDecision('spare')}
                        onDeath={() => handleDecision('death')}
                        isMobile={true}
                    />
                )}
            </BottomSheet>

            {/* Legacy Migration Modal */}
            <LegacyMigrationModal
                isOpen={showMigrationModal}
                onConfirm={handleMigrationConfirm}
                onDecline={handleMigrationDecline}
                data={legacyData}
            />
        </>
    );
}
