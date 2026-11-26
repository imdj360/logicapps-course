import { useEffect, useState } from 'react';
import type { CatalogModule } from '../lib/catalog';
import { getProgress, onProgressChange, type ProgressMap } from '../lib/progress';

interface Props {
  catalog: CatalogModule[];
  activeSlug?: string;
}

export function Sidebar({ catalog, activeSlug }: Props) {
  const activeModule = catalog.find((m) => m.lessons.some((l) => l.slug === activeSlug))?.id;
  const [open, setOpen] = useState<Set<string>>(() => new Set(activeModule ? [activeModule] : []));
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(getProgress());
    return onProgressChange(() => setProgress(getProgress()));
  }, []);

  const published = catalog.flatMap((m) => m.lessons).filter((l) => l.status === 'published');
  const done = published.filter((l) => progress[l.slug]?.completed).length;
  const total = catalog.reduce((n, m) => n + m.lessons.length, 0);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <div className="sidebar__head">Modules <span>{total} lessons</span></div>
      <ul className="modules">
        {catalog.map((m) => {
          const isOpen = open.has(m.id);
          const live = m.lessons.filter((l) => l.status === 'published');
          const moduleDone = live.filter((l) => progress[l.slug]?.completed).length;
          return (
            <li key={m.id} className="module" data-open={isOpen}>
              <button type="button" aria-expanded={isOpen} onClick={() => toggle(m.id)}>
                <svg className="module__caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 1.5 L7 5 L3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                <span className="module__num">{m.number}</span>
                {m.title}
                <span className="module__count">{moduleDone}/{live.length}</span>
              </button>
              {isOpen && (
                <ul className="lessons">
                  {m.lessons.map((l) => (
                    <li key={l.slug}>
                      {l.href ? (
                        <a href={l.href} aria-current={l.slug === activeSlug ? 'page' : undefined}>
                          <span className={`lesson-dot${progress[l.slug]?.completed ? ' lesson-dot--done' : ''}`} aria-hidden="true" />
                          {l.title}
                        </a>
                      ) : (
                        <span className="lesson-soon">
                          <span className="lesson-dot" aria-hidden="true" />
                          {l.title} <span className="soon">Soon</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className="progress-box">
        <div className="progress-box__row"><span>Progress</span><span>{done} / {published.length}</span></div>
        <div className="progress-bar"><span style={{ width: `${published.length ? (done / published.length) * 100 : 0}%` }} /></div>
      </div>
    </>
  );
}
