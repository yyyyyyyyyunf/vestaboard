import { useState } from 'react';
import { Vestaboard, FlipSlot } from '@fly4react/vestaboard';
import styles from './App.module.css';

const PRESETS = [
  { label: 'Hello', value: 'HELLO' },
  { label: 'World', value: 'WORLD' },
  { label: 'Time', value: '12:34' },
  { label: 'Long', value: 'SHIP IT' },
  { label: 'Emoji', value: '🍎🍐🍊🍋', characters: '🍎🍐🍊🍋🍉' },
];

export function App() {
  const [value, setValue] = useState('HELLO');
  const [columns, setColumns] = useState(10);
  const [stagger, setStagger] = useState(0.5);
  const [duration, setDuration] = useState(0.4);
  const [characters, setCharacters] = useState('');

  const charSet = characters || undefined;

  return (
    <div className={styles.app}>
      <h1>@fly4react/vestaboard</h1>

      <section className={styles.section}>
        <h2>Single FlipSlot</h2>
        <FlipSlot value={value[0] || ' '} characters={charSet} />
      </section>

      <section className={styles.section}>
        <h2>Vestaboard</h2>
        <Vestaboard
          value={value}
          columns={columns}
          stagger={stagger}
          duration={duration}
          characters={charSet}
        />
      </section>

      <section className={styles.controls}>
        <h2>Controls</h2>

        <div className={styles.field}>
          <label htmlFor="text">Text</label>
          <input
            id="text"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={columns}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="columns">Columns</label>
          <input
            id="columns"
            type="range"
            min={1}
            max={20}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
          />
          <span>{columns}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="stagger">Stagger</label>
          <input
            id="stagger"
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={stagger}
            onChange={(e) => setStagger(Number(e.target.value))}
          />
          <span>{stagger}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="duration">Duration scale</label>
          <input
            id="duration"
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <span>{duration}</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="characters">Custom characters (optional)</label>
          <input
            id="characters"
            type="text"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            placeholder="Leave empty for default"
          />
        </div>

        <div className={styles.presets}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setValue(preset.value);
                if (preset.characters) setCharacters(preset.characters);
                else setCharacters('');
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
