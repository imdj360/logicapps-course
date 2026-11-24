import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Scene } from '../../lessons/scene-types';
import { Stage } from '../stage/Stage';
import { markComplete, markStepReached } from '../../lib/progress';
import { track } from '../../lib/analytics';
import { useStepNav } from './useStepNav';
import { StepPanel } from './StepPanel';
import { Timeline } from './Timeline';

export interface PlayerStep {
  id: string;
  name: string;
  tag?: 'PROBLEM' | 'FIX' | 'TIP' | 'RECAP';
  html: string;
}

interface Props {
  slug: string;
  scene: Scene;
  steps: PlayerStep[];
  youWillLearn: string[];
  recap?: ReactNode;
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function LessonPlayer({ slug, scene, steps, youWillLearn, recap }: Props) {
  const count = steps.length;
  const nav = useStepNav(count, typeof window === 'undefined' ? '' : window.location.hash);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [reducedMotion] = useState(prefersReducedMotion);
  const completed = useRef(false);

  useEffect(() => { track('lesson_start', { lesson: slug }); }, [slug]);

  useEffect(() => {
    window.history.replaceState(null, '', `#${nav.index + 1}`);
    markStepReached(slug, nav.index);
    track('step_reached', { lesson: slug, step: nav.index + 1 });
    if (nav.index === count - 1 && !completed.current) {
      completed.current = true;
      markComplete(slug);
      track('lesson_complete', { lesson: slug });
    }
  }, [nav.index, slug, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') nav.next();
      else if (e.key === 'ArrowLeft') nav.back();
      else if (e.key === 'r' || e.key === 'R') setReplayKey((k) => k + 1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      } else return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav.next, nav.back]);

  const step = steps[nav.index];
  if (!step) return null;
  const nextName = steps[nav.index + 1]?.name ?? null;

  return (
    <div className="player-root">
      <div className="player">
        <div>
          <div className="panel stage-wrap">
            <div className="stage-toolbar">
              <button type="button" className="btn btn--sm" onClick={() => { setPaused(false); setReplayKey((k) => k + 1); }}>
                ↻ Replay
              </button>
              <button type="button" className="btn btn--sm" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                {paused ? '▶ Play' : '❚❚ Pause'}
              </button>
            </div>
            <Stage scene={scene} stepId={step.id} playing={!paused} reducedMotion={reducedMotion} replayKey={replayKey} />
          </div>
          <Timeline steps={steps} index={nav.index} onSelect={nav.goTo} />
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <StepPanel
            step={step}
            index={nav.index}
            count={count}
            nextName={nextName}
            onNext={nav.next}
            onBack={nav.back}
            recap={recap}
          />
          {youWillLearn.length > 0 && (
            <div className="panel learn-box">
              <h3>You'll learn</h3>
              <ul>{youWillLearn.map((y) => <li key={y}>{y}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
