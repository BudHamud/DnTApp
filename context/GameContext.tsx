'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameStats, Decision, Character } from '@/lib/types';
import { saveStats, loadStats, saveHistory, loadHistory, saveFavorites, loadFavorites } from '@/lib/storage';

interface GameContextType {
    stats: GameStats;
    history: Decision[];
    favorites: string[];
    currentCharacter: Character | null;
    setCurrentCharacter: (character: Character | null) => void;
    makeDecision: (character: Character, type: 'spare' | 'death') => void;
    undoLastDecision: () => void;
    updateStats: (newStats: Partial<GameStats>) => void;
    resetStats: () => void;
    clearHistory: () => void;
    fullReset: () => void;
    toggleFavorite: (characterRef: string) => void;
    isFavorite: (characterRef: string) => boolean;
    importData: (stats: GameStats, history: Decision[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [stats, setStats] = useState<GameStats>({ ecology: 0, peace: 0, healthcare: 0, prosperity: 0 });
    const [history, setHistory] = useState<Decision[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const loadedStats = loadStats();
        const loadedHistory = loadHistory();
        const loadedFavorites = loadFavorites();

        setStats(loadedStats);
        setHistory(loadedHistory);
        setFavorites(loadedFavorites);
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever stats change
    useEffect(() => {
        if (isInitialized) {
            saveStats(stats);
        }
    }, [stats, isInitialized]);

    // Save to localStorage whenever history changes
    useEffect(() => {
        if (isInitialized) {
            saveHistory(history);
        }
    }, [history, isInitialized]);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        if (isInitialized) {
            saveFavorites(favorites);
        }
    }, [favorites, isInitialized]);

    const makeDecision = (character: Character, type: 'spare' | 'death') => {
        const statsImpact: GameStats = {
            ecology: type === 'spare' ? character.spare_ecology : character.death_ecology,
            peace: type === 'spare' ? character.spare_peace : character.death_peace,
            healthcare: type === 'spare' ? character.spare_healthcare : character.death_healthcare,
            prosperity: type === 'spare' ? character.spare_prosperity : character.death_prosperity,
        };

        const decision: Decision = {
            character: character.name,
            characterRef: character.ntt_ref,
            type,
            timestamp: Date.now(),
            statsImpact,
        };

        setStats((prevStats) => ({
            ecology: prevStats.ecology + statsImpact.ecology,
            peace: prevStats.peace + statsImpact.peace,
            healthcare: prevStats.healthcare + statsImpact.healthcare,
            prosperity: prevStats.prosperity + statsImpact.prosperity,
        }));

        setHistory((prevHistory) => [...prevHistory, decision]);
    };

    const undoLastDecision = () => {
        setHistory((prevHistory) => {
            if (prevHistory.length === 0) return prevHistory;

            const lastDecision = prevHistory[prevHistory.length - 1];

            setStats((prevStats) => ({
                ecology: prevStats.ecology - lastDecision.statsImpact.ecology,
                peace: prevStats.peace - lastDecision.statsImpact.peace,
                healthcare: prevStats.healthcare - lastDecision.statsImpact.healthcare,
                prosperity: prevStats.prosperity - lastDecision.statsImpact.prosperity,
            }));

            return prevHistory.slice(0, -1);
        });
    };

    const updateStats = (newStats: Partial<GameStats>) => {
        setStats((prevStats) => ({ ...prevStats, ...newStats }));
    };

    const resetStats = () => {
        setStats({ ecology: 0, peace: 0, healthcare: 0, prosperity: 0 });
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const fullReset = () => {
        // Clear state
        setStats({ ecology: 0, peace: 0, healthcare: 0, prosperity: 0 });
        setHistory([]);
        setFavorites([]);
        setCurrentCharacter(null);

        // Clear local storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('dnt_stats');
            localStorage.removeItem('dnt_history');
            localStorage.removeItem('dnt_favorites');
        }
    };

    const toggleFavorite = (characterRef: string) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(characterRef)
                ? prevFavorites.filter((ref) => ref !== characterRef)
                : [...prevFavorites, characterRef],
        );
    };

    const isFavorite = (characterRef: string): boolean => {
        return favorites.includes(characterRef);
    };

    const importData = (newStats: GameStats, newHistory: Decision[]) => {
        setStats(newStats);
        setHistory(newHistory);
    };

    const value: GameContextType = {
        stats,
        history,
        favorites,
        currentCharacter,
        setCurrentCharacter,
        makeDecision,
        undoLastDecision,
        updateStats,
        resetStats,
        clearHistory,
        toggleFavorite,
        isFavorite,
        importData,
        fullReset,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
