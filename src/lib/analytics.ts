export type AnalyticsEvent = 'lesson_start' | 'step_reached' | 'lesson_complete' | 'devto_click';

type Plausible = (event: string, opts?: { props?: Record<string, string | number> }) => void;

export function track(event: AnalyticsEvent, props?: Record<string, string | number>): void {
  try {
    const plausible = (globalThis as { plausible?: Plausible }).plausible;
    plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page.
  }
}
