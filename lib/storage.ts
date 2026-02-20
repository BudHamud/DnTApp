import { GameStats, Decision, SaveData } from './types';

const STORAGE_KEYS = {
    STATS: 'dnt_stats',
    HISTORY: 'dnt_history',
    FAVORITES: 'dnt_favorites',
} as const;

const CURRENT_VERSION = '1.0.0';

// Stats operations
export const saveStats = (stats: GameStats): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    }
};

export const loadStats = (): GameStats => {
    if (typeof window === 'undefined') {
        return { ecology: 0, peace: 0, healthcare: 0, prosperity: 0 };
    }

    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!stored) {
        return { ecology: 0, peace: 0, healthcare: 0, prosperity: 0 };
    }

    try {
        return JSON.parse(stored);
    } catch {
        return { ecology: 0, peace: 0, healthcare: 0, prosperity: 0 };
    }
};

// History operations
export const saveHistory = (history: Decision[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
};

export const loadHistory = (): Decision[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

// Favorites operations
export const saveFavorites = (favorites: string[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
};

export const loadFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

// Nota: funciones de exportación/descarga y limpieza global de storage
// se eliminaron porque no se usan en la versión actual de la app.
