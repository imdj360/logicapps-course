export interface LessonProgress { lastStep: number; completed: boolean }
export type ProgressMap = Record<string, LessonProgress>;

const KEY = 'lac:progress:v1';
const EVENT = 'lac:progress';

const defaultStorage = (): Storage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

export function getProgress(storage = defaultStorage()): ProgressMap {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

function update(slug: string, change: (p: LessonProgress) => LessonProgress, storage = defaultStorage()) {
  const all = getProgress(storage);
  all[slug] = change(all[slug] ?? { lastStep: 0, completed: false });
  try {
    storage?.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage blocked (private mode, quota) — progress just isn't remembered.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENT));
}

export const getLesson = (slug: string, storage = defaultStorage()): LessonProgress | null =>
  getProgress(storage)[slug] ?? null;

export const markStepReached = (slug: string, stepIndex: number, storage = defaultStorage()) =>
  update(slug, (p) => ({ ...p, lastStep: Math.max(p.lastStep, stepIndex) }), storage);

export const markComplete = (slug: string, storage = defaultStorage()) =>
  update(slug, (p) => ({ ...p, completed: true }), storage);

export const completedCount = (slugs: string[], storage = defaultStorage()): number => {
  const all = getProgress(storage);
  return slugs.filter((s) => all[s]?.completed).length;
};

export function onProgressChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
