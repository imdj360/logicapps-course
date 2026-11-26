import { track } from '../lib/analytics';

interface Props {
  relatedArticles: { title: string; url: string }[];
  devtoUrl: string | null;
}

export function RecapLinks({ relatedArticles, devtoUrl }: Props) {
  if (relatedArticles.length === 0 && !devtoUrl) return null;
  return (
    <div className="recap-links">
      {relatedArticles.length > 0 && (
        <>
          <h3>Read more</h3>
          <ul>
            {relatedArticles.map((a) => <li key={a.url}><a href={a.url} target="_blank" rel="noopener">{a.title}</a></li>)}
          </ul>
        </>
      )}
      {devtoUrl && (
        <a href={devtoUrl} onClick={() => track('devto_click')}>Follow Daniel on dev.to →</a>
      )}
    </div>
  );
}
