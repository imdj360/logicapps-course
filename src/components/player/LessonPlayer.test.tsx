import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LessonPlayer, type PlayerStep } from './LessonPlayer';
import type { Scene } from '../../lessons/scene-types';
import * as progress from '../../lib/progress';
import * as analytics from '../../lib/analytics';

const scene: Scene = {
  viewBox: [600, 300],
  nodes: [{ id: 't', kind: 'trigger', label: 'Trigger', x: 100, y: 100 }],
  edges: [],
  steps: {
    s1: { visible: ['t'], chips: [] },
    s2: { visible: ['t'], chips: [] },
    s3: { visible: ['t'], chips: [] },
  },
  legend: [],
};

const steps: PlayerStep[] = [
  { id: 's1', name: 'First step', tag: 'PROBLEM', html: '<p>one</p>' },
  { id: 's2', name: 'Second step', html: '<p>two</p>' },
  { id: 's3', name: 'Wrap up', tag: 'RECAP', html: '<p>three</p>' },
];

const renderPlayer = (recap?: React.ReactNode) =>
  render(<LessonPlayer slug="demo" scene={scene} steps={steps} youWillLearn={['a thing']} recap={recap} />);

const heading = () => screen.getByRole('heading', { level: 2 }).textContent;

beforeEach(() => { window.history.replaceState(null, '', '/lessons/demo/'); });
afterEach(() => vi.restoreAllMocks());

describe('LessonPlayer', () => {
  it('opens on the step in the URL hash, clamped', () => {
    window.history.replaceState(null, '', '/lessons/demo/#99');
    renderPlayer();
    expect(heading()).toBe('Wrap up');
  });

  it('advances with the right arrow and updates the hash', () => {
    renderPlayer();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(heading()).toBe('Second step');
    expect(window.location.hash).toBe('#2');
  });

  it('labels the next button with the next step name', () => {
    renderPlayer();
    expect(screen.getByRole('button', { name: /Next: Second step/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  it('marks the lesson complete on the last step', () => {
    const complete = vi.spyOn(progress, 'markComplete');
    const track = vi.spyOn(analytics, 'track');
    renderPlayer();
    fireEvent.click(screen.getByRole('button', { name: /Next: Second step/ }));
    fireEvent.click(screen.getByRole('button', { name: /Next: Wrap up/ }));
    expect(complete).toHaveBeenCalledWith('demo');
    expect(track).toHaveBeenCalledWith('lesson_complete', { lesson: 'demo' });
  });

  it('tracks lesson start and each step reached', () => {
    const reached = vi.spyOn(progress, 'markStepReached');
    const track = vi.spyOn(analytics, 'track');
    renderPlayer();
    expect(track).toHaveBeenCalledWith('lesson_start', { lesson: 'demo' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(reached).toHaveBeenCalledWith('demo', 1);
    expect(track).toHaveBeenCalledWith('step_reached', { lesson: 'demo', step: 2 });
  });

  it('toggles pause with the space key', () => {
    renderPlayer();
    const pause = screen.getByRole('button', { name: /Pause/ });
    expect(pause).toHaveAttribute('aria-pressed', 'false');
    fireEvent.keyDown(window, { key: ' ' });
    expect(pause).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignores keys while typing in an input', () => {
    render(<><input aria-label="search" /><LessonPlayer slug="demo" scene={scene} steps={steps} youWillLearn={[]} /></>);
    const input = screen.getByLabelText('search');
    input.focus();
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(heading()).toBe('First step');
  });

  it('jumps to a step from the timeline', () => {
    renderPlayer();
    fireEvent.click(screen.getByRole('button', { name: /3\s*Wrap up/ }));
    expect(heading()).toBe('Wrap up');
  });

  it('shows the recap content only on the last step', () => {
    renderPlayer(<p>recap links</p>);
    expect(screen.queryByText('recap links')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /3\s*Wrap up/ }));
    expect(screen.getByText('recap links')).toBeInTheDocument();
  });
});
