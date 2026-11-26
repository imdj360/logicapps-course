import { useEffect, useState } from 'react';
import type { Scene } from '../../lessons/scene-types';
import { LessonPlayer, type PlayerStep } from './LessonPlayer';
import { RecapLinks } from '../RecapLinks';
import type { NextLesson } from '../../lib/catalog';

interface Props {
  slug: string;
  scene: Scene;
  youWillLearn: string[];
  relatedArticles: { title: string; url: string }[];
  devtoUrl: string | null;
  next?: NextLesson | null;
}

const TAGS = new Set(['PROBLEM', 'FIX', 'TIP', 'RECAP']);

/**
 * Step text is authored in MDX and rendered statically (so it is indexable and readable
 * without JS). On hydration we read those sections back out of the DOM for the player.
 */
function readSteps(root: Element): PlayerStep[] {
  return [...root.querySelectorAll<HTMLElement>('[data-step]')].map((s) => {
    const tag = s.dataset.stepTag;
    return {
      id: s.dataset.stepId ?? '',
      name: s.dataset.stepName ?? '',
      tag: tag && TAGS.has(tag) ? (tag as PlayerStep['tag']) : undefined,
      html: s.querySelector('.step-body')?.innerHTML ?? '',
    };
  });
}

export function LessonIsland({ slug, scene, youWillLearn, relatedArticles, devtoUrl, next = null }: Props) {
  const [steps, setSteps] = useState<PlayerStep[] | null>(null);

  useEffect(() => {
    const root = document.getElementById('static-steps');
    if (!root) return;
    setSteps(readSteps(root));
    root.setAttribute('data-hydrated', 'true');
    // Hidden (not just clipped) so screen readers don't get every step a second time.
    root.hidden = true;
  }, []);

  if (!steps || steps.length === 0) return null;
  return (
    <LessonPlayer
      slug={slug}
      scene={scene}
      steps={steps}
      youWillLearn={youWillLearn}
      recap={<RecapLinks relatedArticles={relatedArticles} devtoUrl={devtoUrl} />}
      next={next}
    />
  );
}
