'use client';

import { useState } from 'react';
import styles from './Classic.module.css';

interface SearchPanelProps {
    people: string[];
    onSelect: (index: number) => void;
}

export default function SearchPanel({ people, onSelect }: SearchPanelProps) {
    const [query, setQuery] = useState('');

    const filtered = query
        ? people.filter(p => p.toLowerCase().includes(query.toLowerCase()))
        : people;

    function handleSubmit(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const idx = people.findIndex(p => p.toLowerCase() === query.toLowerCase());
        if (idx !== -1) {
            onSelect(idx);
            setQuery('');
        }
    }

    return (
        <div className={styles.searchContainer}>
            <p className={styles.search}>Search:</p>
            <div className={styles.searchBlock}>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    id="getData"
                />
                <a href="#" onClick={handleSubmit}>
                    <i className="fa-solid fa-magnifying-glass" />
                </a>
            </div>
            {query && (
                <div className={styles.searchDropdown}>
                    {filtered.length === 0 ? (
                        <span>{"Isn't here"}</span>
                    ) : (
                        filtered.map((name, i) => (
                            <div key={i} className={styles.peopleCard}>
                                <a href="#" onClick={e => {
                                    e.preventDefault();
                                    // Use original index from the full list
                                    onSelect(people.indexOf(name));
                                    setQuery('');
                                }}>
                                    {name}
                                </a>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
