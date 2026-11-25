import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Scene } from '../../lessons/scene-types';
import { Stage } from '../stage/Stage';
import { markComplete, markStepReached } from '../../lib/progress';
import { track } from '../../lib/analytics';
import { parseStepHash, useStepNav } from './useStepNav';
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

const isInteractive = (el: EventTarget | null) =>
  el instanceof Element && !!el.closest('button, a, summary, [role="button"], [role="link"]');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function LessonPlayer({ slug, scene, steps, youWillLearn, recap }: Props) {
  const count = steps.length;
  const nav = useStepNav(count, typeof window === 'undefined' ? '' : window.location.hash);
  // With reduced motion the diagram starts paused (showing "Play"), so a still diagram doesn't look broken.
  // Pressing Play or Replay is an explicit opt-in to motion for this lesson.
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [paused, setPaused] = useState(reducedMotion);
  const [replayKey, setReplayKey] = useState(0);
  const play = () => { setReducedMotion(false); setPaused(false); };
  const replay = () => { play(); setReplayKey((k) => k + 1); };
  const completed = useRef(false);
  const visited = useRef(new Set<number>());
  const firstIndex = useRef(nav.index);
  const moved = useRef(false);

  useEffect(() => { track('lesson_start', { lesson: slug }); }, [slug]);

  useEffect(() => {
    window.history.replaceState(null, '', `#${nav.index + 1}`);
    markStepReached(slug, nav.index);
    track('step_reached', { lesson: slug, step: nav.index + 1 });
    visited.current.add(nav.index);
    if (nav.index !== firstIndex.current) moved.current = true;
    // A lesson counts as finished only when the visitor navigated to the recap and saw at
    // least half the steps on the way — not when a shared link opens straight on it.
    const engaged = moved.current && visited.current.size >= Math.ceil(count / 2);
    if (nav.index === count - 1 && engaged && !completed.current) {
      completed.current = true;
      markComplete(slug);
      track('lesson_complete', { lesson: slug });
    }
  }, [nav.index, slug, count]);

  useEffect(() => {
    const onHash = () => nav.goTo(parseStepHash(window.location.hash, count));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [nav.goTo, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ' && isInteractive(e.target)) return;
      if (e.key === 'ArrowRight') nav.next();
      else if (e.key === 'ArrowLeft') nav.back();
      else if (e.key === 'r' || e.key === 'R') replay();
      else if (e.key === ' ') {
        e.preventDefault();
        if (paused) play(); else setPaused(true);
      } else return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav.next, nav.back, paused]);

  const step = steps[nav.index];
  if (!step) return null;
  const nextName = steps[nav.index + 1]?.name ?? null;

  return (
    <div className="player-root">
      <div className="player">
        <div className="player__main">
          <div className="panel stage-wrap">
            <div className="stage-toolbar">
              <button type="button" className="btn btn--sm" onClick={replay}>
                ↻ Replay
              </button>
              <button type="button" className="btn btn--sm" aria-pressed={paused} onClick={() => (paused ? play() : setPaused(true))}>
                {paused ? '▶ Play' : '❚❚ Pause'}
              </button>
            </div>
            <Stage scene={scene} stepId={step.id} playing={!paused} reducedMotion={reducedMotion} replayKey={replayKey} />
          </div>
          <Timeline steps={steps} index={nav.index} onSelect={nav.goTo} />
        </div>
        <div className="player__side">
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
