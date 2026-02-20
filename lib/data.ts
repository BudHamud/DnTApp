import { Character } from './types';

let cachedCharacters: Character[] | null = null;

export const fetchCharacters = async (): Promise<Character[]> => {
    if (cachedCharacters) {
        return cachedCharacters;
    }

    try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        console.log(`Fetching characters from ${basePath}/api.json...`);
        const response = await fetch(`${basePath}/api.json`);
        if (!response.ok) {
            console.error(`Failed to fetch characters: ${response.status} ${response.statusText}`);
            throw new Error('Failed to fetch characters');
        }
        const data: Character[] = await response.json();
        console.log(`Fetched ${data.length} characters.`);

        // Deduplicate characters by ntt_ref
        // Use a Map to keep the last occurrence or first? Let's keep first.
        const uniqueCharacters = Array.from(new Map(data.map(char => [char.ntt_ref, char])).values());

        cachedCharacters = uniqueCharacters;
        return uniqueCharacters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
};

export const searchCharacters = (
    characters: Character[],
    query: string
): Character[] => {
    if (!query.trim()) return characters;

    const lowerQuery = query.toLowerCase();
    return characters.filter(
        (char) =>
            (char.name && char.name.toLowerCase().includes(lowerQuery)) ||
            (char.job && char.job.toLowerCase().includes(lowerQuery)) ||
            (char.age && String(char.age).includes(lowerQuery)) ||
            (char.ntt_ref && char.ntt_ref.toLowerCase().includes(lowerQuery))
    );
};

export const sortCharacters = (
    characters: Character[],
    sortBy: 'name' | 'age' | 'job'
): Character[] => {
    const sorted = [...characters];

    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'age':
            return sorted.sort((a, b) => {
                const ageA = typeof a.age === 'number' ? a.age : parseInt(String(a.age));
                const ageB = typeof b.age === 'number' ? b.age : parseInt(String(b.age));
                return ageA - ageB;
            });
        case 'job':
            return sorted.sort((a, b) => a.job.localeCompare(b.job));
        default:
            return sorted;
    }
};

export const getUniqueJobs = (characters: Character[]): string[] => {
    const jobs = characters.map((char) => char.job);
    return Array.from(new Set(jobs)).sort();
};
