export interface Person {
    name: string;
    age?: number;
    job?: string;
    // Spare stats
    spare_ecology: number;
    spare_peace: number;
    spare_healthcare: number;
    spare_prosperity: number;
    // Death stats
    death_ecology: number;
    death_peace: number;
    death_healthcare: number;
    death_prosperity: number;
}

export interface Stats {
    ecology: number;
    peace: number;
    healthcare: number;
    prosperity: number;
}
