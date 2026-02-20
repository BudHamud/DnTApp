'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import StatusPanel from './StatusPanel';
import SearchPanel from './SearchPanel';
import PeopleList from './PeopleList';
import PersonCard from './PersonCard';
import styles from './Classic.module.css';
import { Person, Stats } from './types';
import { useClassicStats } from './hooks/useClassicStats';
import { useClassicData } from './hooks/useClassicData';
import { calculateOutcome } from './utils/gameLogic';

interface ClassicTrackerProps {
    v2Href?: string;
}

export default function ClassicTracker({ v2Href = '/modern' }: ClassicTrackerProps) {
    // Custom Hooks
    const {
        stats,
        updateStats,
        clearStats,
        showV2Button,
        toggleV2Button,
        migrationState,
        handleMigrateHere,
        handleGoToV2,
    } = useClassicStats();

    const { data, people } = useClassicData();

    // Local UI State
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [currentName, setCurrentName] = useState<string | null>(null);
    const [cond, setCond] = useState(0); // 0=none, 1=death, 2=live

    // Handlers (Memoized)
    const handleSetStats = useCallback((newStats: Stats) => {
        updateStats(newStats);
    }, [updateStats]);

    const handleClearStats = useCallback(() => {
        clearStats();
    }, [clearStats]);

    const handleSelectPerson = useCallback((idx: number) => {
        if (!data[idx]) return;
        setSelectedPerson(data[idx]);
        setCurrentName(data[idx].name);
        setCond(0);
    }, [data]);

    const handleBack = useCallback(() => {
        setSelectedPerson(null);
        setCond(0);
    }, []);

    const handleDie = useCallback(() => {
        if (!selectedPerson) return;

        const newStats = calculateOutcome(stats, selectedPerson, 'death');
        updateStats(newStats);

        setCond(1);
        setSelectedPerson(null);
    }, [selectedPerson, stats, updateStats]);

    const handleLive = useCallback(() => {
        if (!selectedPerson) return;

        const newStats = calculateOutcome(stats, selectedPerson, 'live');
        updateStats(newStats);

        setCond(2);
        setSelectedPerson(null);
    }, [selectedPerson, stats, updateStats]);

    // Derived UI values
    const statusEmoji = cond === 1 ? '💀' : cond === 2 ? '😀' : '';
    const currentLabel = cond === 0
        ? (currentName ? `Current: ${currentName}` : '')
        : `Last: ${currentName}`;

    return (
        <div className={styles.wrapper}>

            {/* ── Migration Modal ── */}
            {migrationState === 'pending' && (
                <div className={styles.migrationOverlay}>
                    <div className={styles.migrationModal}>
                        <h2>New version available!</h2>
                        <p>
                            Your saved data is in an old format. You can migrate it now
                            or check out <strong>V2</strong> (Modern) and migrate from there.
                        </p>
                        <div className={styles.migrationBtns}>
                            <button className={styles.migrationBtnV2} onClick={() => handleGoToV2(v2Href)}>
                                <i className="fa-solid fa-arrow-up-right-from-square" />
                                Go to V2
                            </button>
                            <button className={styles.migrationBtnStay} onClick={handleMigrateHere}>
                                Stay in Classic
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* V2 Button — conditionally shown */}
            {showV2Button && (
                <Link href={v2Href} className={styles.v2Button}>
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                    Go to V2
                </Link>
            )}

            <header className={styles.header}>
                <section className={styles.mainHeader}>
                    <StatusPanel
                        ecology={stats.ecology}
                        peace={stats.peace}
                        healthcare={stats.healthcare}
                        prosperity={stats.prosperity}
                        onUpdate={handleSetStats}
                        onClear={handleClearStats}
                        showV2Button={showV2Button}
                        onToggleV2Button={toggleV2Button}
                    />
                    <SearchPanel people={people} onSelect={handleSelectPerson} />
                </section>
                <section className={styles.current}>
                    <div className={styles.actualLemon}>{currentLabel}</div>
                    <div className={styles.status}>{statusEmoji}</div>
                </section>
            </header>

            <main className={styles.main}>
                {selectedPerson ? (
                    <PersonCard
                        person={selectedPerson}
                        onDie={handleDie}
                        onLive={handleLive}
                        onBack={handleBack}
                    />
                ) : (
                    <PeopleList people={people} onSelect={handleSelectPerson} />
                )}
            </main>
        </div>
    );
}
