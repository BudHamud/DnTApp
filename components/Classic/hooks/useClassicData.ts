import { useState, useEffect } from 'react';
import { Person } from '../types';

export function useClassicData() {
    const [data, setData] = useState<Person[]>([]);
    const [people, setPeople] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        fetch(`${basePath}/api.json`)
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch api.json');
                return r.json();
            })
            .then((d: Person[]) => {
                setData(d);
                setPeople(d.map(e => e.name));
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load api.json', err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    return { data, people, isLoading, error };
}
