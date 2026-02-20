'use client';

import styles from './Classic.module.css';
import { Person } from './types';

interface PersonCardProps {
    person: Person;
    onLive: () => void;
    onDie: () => void;
    onBack: () => void;
}

export default function PersonCard({ person, onLive, onDie, onBack }: PersonCardProps) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    return (
        <div className={styles.cardContainer}>
            <a href="#" className={styles.volver} onClick={e => { e.preventDefault(); onBack(); }}>
                <i className="fa-solid fa-arrow-left" />
            </a>
            <h3>{person.name}</h3>
            <div className={styles.info}>
                <div className={`${styles.cardInfo} ${styles.spare}`}>
                    <h4>Spare</h4>
                    <ul>
                        <li><img src={`${basePath}/img/ecology.svg`} alt="ecology" /> Ecology: {person.spare_ecology}</li>
                        <li><img src={`${basePath}/img/peace.svg`} alt="peace" /> Peace: {person.spare_peace}</li>
                        <li><img src={`${basePath}/img/healthcare.svg`} alt="healthcare" /> Healthcare: {person.spare_healthcare}</li>
                        <li><img src={`${basePath}/img/prosperity.svg`} alt="prosperity" /> Prosperity: {person.spare_prosperity}</li>
                    </ul>
                    <a href="#" onClick={e => { e.preventDefault(); onLive(); }}>
                        <img src={`${basePath}/img/live.svg`} alt="spare" />
                    </a>
                </div>
                <div className={`${styles.cardInfo} ${styles.death}`}>
                    <h4>Death</h4>
                    <ul>
                        <li><img src={`${basePath}/img/ecology.svg`} alt="ecology" /> Ecology: {person.death_ecology}</li>
                        <li><img src={`${basePath}/img/peace.svg`} alt="peace" /> Peace: {person.death_peace}</li>
                        <li><img src={`${basePath}/img/healthcare.svg`} alt="healthcare" /> Healthcare: {person.death_healthcare}</li>
                        <li><img src={`${basePath}/img/prosperity.svg`} alt="prosperity" /> Prosperity: {person.death_prosperity}</li>
                    </ul>
                    <a href="#" onClick={e => { e.preventDefault(); onDie(); }}>
                        <img src={`${basePath}/img/die.svg`} alt="die" />
                    </a>
                </div>
            </div>
        </div>
    );
}
