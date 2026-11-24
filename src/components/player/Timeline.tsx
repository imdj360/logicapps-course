import type { PlayerStep } from './LessonPlayer';

interface Props {
  steps: PlayerStep[];
  index: number;
  onSelect: (i: number) => void;
}

export function Timeline({ steps, index, onSelect }: Props) {
  return (
    <nav className="panel timeline" aria-label="Steps in this lesson">
      <div className="timeline__head">In this lesson <span>Step {index + 1} of {steps.length}</span></div>
      <ol>
        {steps.map((s, i) => (
          <li key={s.id} className={i < index ? 'is-done' : undefined}>
            <button type="button" onClick={() => onSelect(i)} aria-current={i === index ? 'step' : undefined}>
              <span className="timeline__num">{i + 1}</span>
              {s.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
