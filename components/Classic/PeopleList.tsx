'use client';

import styles from './Classic.module.css';

interface PeopleListProps {
    people: string[];
    onSelect: (index: number) => void;
}

export default function PeopleList({ people, onSelect }: PeopleListProps) {
    return (
        <div className={styles.cardContainer}>
            {people.map((name, i) => (
                <div key={i} className={styles.peopleCard}>
                    <a href="#" onClick={e => { e.preventDefault(); onSelect(i); }}>
                        {name}
                    </a>
                </div>
            ))}
        </div>
    );
}
