import type { Scene } from '../../lessons/scene-types';

export function Legend({ items }: { items: Scene['legend'] }) {
  if (items.length === 0) return null;
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.label}>
          <span className={`legend__dot legend__dot--${i.tone}`} aria-hidden="true" />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
