'use client';

import { useState } from 'react';
import styles from './Classic.module.css';
import { Stats } from './types';

interface StatusPanelProps {
    ecology: number;
    peace: number;
    healthcare: number;
    prosperity: number;
    onUpdate: (stats: Stats) => void;
    onClear: () => void;
    showV2Button: boolean;
    onToggleV2Button: (show: boolean) => void;
}

export default function StatusPanel({ ecology, peace, healthcare, prosperity, onUpdate, onClear, showV2Button, onToggleV2Button }: StatusPanelProps) {
    const [changeOpen, setChangeOpen] = useState(false);
    const [inputs, setInputs] = useState({ eco: '', pea: '', hel: '', pro: '' });

    function handleSet() {
        onUpdate({
            ecology: Number(inputs.eco) || 0,
            peace: Number(inputs.pea) || 0,
            healthcare: Number(inputs.hel) || 0,
            prosperity: Number(inputs.pro) || 0,
        });
        setInputs({ eco: '', pea: '', hel: '', pro: '' });
        setChangeOpen(false);
    }

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    return (
        <div className={styles.actual}>
            <ul>
                <li><img src={`${basePath}/img/ecology.svg`} alt="ecology" /> Ecology: {ecology}</li>
                <li><img src={`${basePath}/img/peace.svg`} alt="peace" /> Peace: {peace}</li>
                <li><img src={`${basePath}/img/healthcare.svg`} alt="healthcare" />Healthcare: {healthcare}</li>
                <li><img src={`${basePath}/img/prosperity.svg`} alt="prosperity" />Prosperity: {prosperity}</li>
            </ul>
            <button className={styles.change} onClick={() => setChangeOpen(!changeOpen)} title="Settings">
                <i className="fa-solid fa-gear" />
            </button>
            <button className={styles.reset} onClick={onClear} title="Reset stats">
                <i className="fa-solid fa-rotate-left" />
            </button>

            {changeOpen && (
                <div className={styles.changeStatus}>
                    <p>Set Stats</p>
                    <p>Ecology</p>
                    <input type="number" placeholder="0" value={inputs.eco} onChange={e => setInputs(p => ({ ...p, eco: e.target.value }))} />
                    <p>Peace</p>
                    <input type="number" placeholder="0" value={inputs.pea} onChange={e => setInputs(p => ({ ...p, pea: e.target.value }))} />
                    <p>Healthcare</p>
                    <input type="number" placeholder="0" value={inputs.hel} onChange={e => setInputs(p => ({ ...p, hel: e.target.value }))} />
                    <p>Prosperity</p>
                    <input type="number" placeholder="0" value={inputs.pro} onChange={e => setInputs(p => ({ ...p, pro: e.target.value }))} />
                    <div className={styles.btns}>
                        <button onClick={handleSet}>Set</button>
                        <button onClick={() => setChangeOpen(false)}>Close</button>
                    </div>

                    <hr className={styles.settingsDivider} />

                    <label className={styles.settingsLabel}>
                        Show V2 button
                        <input
                            type="checkbox"
                            checked={showV2Button}
                            onChange={e => onToggleV2Button(e.target.checked)}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
