import { track } from '../lib/analytics';

interface Props {
  relatedArticles: { title: string; url: string }[];
  learnLinks?: { title: string; url: string }[];
  devtoUrl: string | null;
}

export function RecapLinks({ relatedArticles, learnLinks = [], devtoUrl }: Props) {
  if (relatedArticles.length === 0 && learnLinks.length === 0 && !devtoUrl) return null;
  return (
    <div className="recap-links">
      {learnLinks.length > 0 && (
        <>
          <h3>On Microsoft Learn</h3>
          <ul>
            {learnLinks.map((a) => <li key={a.url}><a href={a.url}>{a.title}</a></li>)}
          </ul>
        </>
      )}
      {relatedArticles.length > 0 && (
        <>
          <h3>Read more</h3>
          <ul>
            {relatedArticles.map((a) => <li key={a.url}><a href={a.url}>{a.title}</a></li>)}
          </ul>
        </>
      )}
      {devtoUrl && (
        <a href={devtoUrl} onClick={() => track('devto_click')}>Follow Daniel on dev.to →</a>
      )}
    </div>
  );
}
