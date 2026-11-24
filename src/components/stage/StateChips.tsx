import type { Chip } from '../../lessons/scene-types';

export function StateChips({ chips }: { chips: Chip[] }) {
  return (
    <ul className="chips" aria-label="Current state">
      {chips.map((c) => (
        <li key={c.label} className={`chip chip--${c.tone ?? 'neutral'}`}>
          <span className="chip__label">{c.label}</span>
          <span className="chip__value">{c.value}</span>
        </li>
      ))}
    </ul>
  );
}
