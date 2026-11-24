import type { ReactNode } from 'react';
import type { PlayerStep } from './LessonPlayer';

interface Props {
  step: PlayerStep;
  index: number;
  count: number;
  nextName: string | null;
  onNext: () => void;
  onBack: () => void;
  recap?: ReactNode;
}

export function StepPanel({ step, index, count, nextName, onNext, onBack, recap }: Props) {
  return (
    <div className="panel step-panel" aria-live="polite">
      <div className="step-panel__top">
        <div className="step-panel__count">
          <button type="button" className="step-arrow" onClick={onBack} disabled={index === 0} aria-label="Previous step" title="Previous step (←)">←</button>
          <span>Step {index + 1} / {count}</span>
          <button type="button" className="step-arrow" onClick={onNext} disabled={!nextName} aria-label="Next step" title="Next step (→)">→</button>
        </div>
        {step.tag && <span className={`tag tag--${step.tag}`}>{step.tag}</span>}
      </div>
      <h2>{step.name}</h2>
      <div className="step-body" dangerouslySetInnerHTML={{ __html: step.html }} />
      {index === count - 1 && recap}
      <div className="step-nav">
        <button type="button" className="btn" onClick={onBack} disabled={index === 0}>Back</button>
        <button type="button" className="btn btn--primary" onClick={onNext} disabled={!nextName}>
          {nextName ? <>Next: {nextName} <span aria-hidden="true">→</span></> : 'Lesson complete'}
        </button>
      </div>
      <div className="keys" aria-hidden="true">
        <span><kbd>←</kbd> <kbd>→</kbd> step</span>
        <span><kbd>R</kbd> replay</span>
        <span><kbd>Space</kbd> pause</span>
      </div>
    </div>
  );
}
