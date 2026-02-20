import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Stats } from '../types';

const LEGACY_KEYS = ['ecology', 'peace', 'healthcare', 'prosperity'];

/** Detect if there are legacy keys but no dnt_stats yet */
function hasLegacyData() {
    if (typeof window === 'undefined') return false;
    const hasModern = !!localStorage.getItem('dnt_stats');
    if (hasModern) return false;
    return LEGACY_KEYS.some(k => {
        const v = Number(localStorage.getItem(k));
        return !isNaN(v) && v !== 0;
    });
}

/** Read stats — modern key only */
function loadStats(): Stats {
    if (typeof window === 'undefined') return { ecology: 0, peace: 0, healthcare: 0, prosperity: 0 };

    const modernStats = localStorage.getItem('dnt_stats');
    if (modernStats) {
        try {
            const parsed = JSON.parse(modernStats);
            return {
                ecology: parsed.ecology || 0,
                peace: parsed.peace || 0,
                healthcare: parsed.healthcare || 0,
                prosperity: parsed.prosperity || 0,
            };
        } catch (e) {
            console.error('Failed to parse dnt_stats', e);
        }
    }

    // No modern key — return zeros (migration will handle legacy)
    return { ecology: 0, peace: 0, healthcare: 0, prosperity: 0 };
}

/** Read legacy keys into a stats object */
function readLegacyStats(): Stats {
    return {
        ecology: Number(localStorage.getItem('ecology')) || 0,
        peace: Number(localStorage.getItem('peace')) || 0,
        healthcare: Number(localStorage.getItem('healthcare')) || 0,
        prosperity: Number(localStorage.getItem('prosperity')) || 0,
    };
}

/** Migrate: write dnt_stats from legacy, then delete legacy keys */
function migrateLegacyToModern(): Stats {
    const stats = readLegacyStats();
    localStorage.setItem('dnt_stats', JSON.stringify(stats));
    LEGACY_KEYS.forEach(k => localStorage.removeItem(k));
    return stats;
}

/** Save — only writes dnt_stats, no legacy keys */
function saveStats(stats: Stats) {
    localStorage.setItem('dnt_stats', JSON.stringify(stats));
}

export function useClassicStats() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({ ecology: 0, peace: 0, healthcare: 0, prosperity: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [showV2Button, setShowV2Button] = useState(false);
    // Migration modal: null = no modal, 'pending' = showing modal
    const [migrationState, setMigrationState] = useState<'pending' | null>(null);

    // Load on mount — detect legacy data
    useEffect(() => {
        if (hasLegacyData()) {
            // Show migration modal — don't load stats yet
            setMigrationState('pending');
        } else {
            setStats(loadStats());
        }

        const saved = localStorage.getItem('dnt_show_v2_btn');
        // Default to true if not set, otherwise use saved value
        if (saved === null) {
            setShowV2Button(true);
        } else {
            setShowV2Button(saved === 'true');
        }
        setIsLoaded(true);
    }, []);

    // Persist changes (only after migration is done)
    useEffect(() => {
        if (isLoaded && migrationState === null) {
            saveStats(stats);
        }
    }, [stats, isLoaded, migrationState]);

    /** User chose to migrate here and stay in V1 */
    const handleMigrateHere = useCallback(() => {
        const migrated = migrateLegacyToModern();
        setStats(migrated);
        setMigrationState(null);
    }, []);

    /** User chose to go to V2 — migrate data first so V2 sees it, then redirect */
    const handleGoToV2 = useCallback((v2Href: string) => {
        migrateLegacyToModern();
        router.push(v2Href);
    }, [router]);

    const updateStats = useCallback((newStats: Stats) => {
        setStats(newStats);
    }, []);

    const toggleV2Button = useCallback((val: boolean) => {
        setShowV2Button(val);
        localStorage.setItem('dnt_show_v2_btn', String(val));
    }, []);

    const clearStats = useCallback(() => {
        setStats({ ecology: 0, peace: 0, healthcare: 0, prosperity: 0 });
    }, []);

    return {
        stats,
        updateStats,
        clearStats,
        isLoaded,
        showV2Button,
        toggleV2Button,
        migrationState,
        handleMigrateHere,
        handleGoToV2,
    };
}
