export interface Character {
    ntt_ref: string;
    name: string;
    age: string;
    job: string;
    bio?: string;
    death_ecology: number;
    death_peace: number;
    death_healthcare: number;
    death_prosperity: number;
    spare_ecology: number;
    spare_peace: number;
    spare_healthcare: number;
    spare_prosperity: number;
    death_news: string[];
    spare_news: string[];
}

export interface GameStats {
    ecology: number;
    peace: number;
    healthcare: number;
    prosperity: number;
}

export interface Decision {
    character: string;
    characterRef: string;
    type: 'spare' | 'death';
    timestamp: number;
    statsImpact: GameStats;
}

export type StatKey = keyof GameStats;

export interface SaveData {
    stats: GameStats;
    history: Decision[];
    timestamp: number;
    version: string;
}
