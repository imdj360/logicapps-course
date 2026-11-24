import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecapLinks } from './RecapLinks';

const articles = [
  { title: 'Retry policies explained', url: 'https://dev.to/x/retry' },
  { title: 'Run-after deep dive', url: 'https://dev.to/x/run-after' },
];

describe('RecapLinks', () => {
  it('links each related article', () => {
    render(<RecapLinks relatedArticles={articles} devtoUrl={null} />);
    expect(screen.getByRole('link', { name: 'Retry policies explained' })).toHaveAttribute('href', 'https://dev.to/x/retry');
    expect(screen.getByRole('link', { name: 'Run-after deep dive' })).toBeInTheDocument();
  });

  it('shows the follow link only when a dev.to url is configured', () => {
    const { rerender } = render(<RecapLinks relatedArticles={articles} devtoUrl={null} />);
    expect(screen.queryByRole('link', { name: /Follow Daniel on dev.to/ })).toBeNull();
    rerender(<RecapLinks relatedArticles={articles} devtoUrl="https://dev.to/daniel" />);
    expect(screen.getByRole('link', { name: /Follow Daniel on dev.to/ })).toHaveAttribute('href', 'https://dev.to/daniel');
  });

  it('links the Microsoft Learn pages under their own heading', () => {
    render(<RecapLinks relatedArticles={[]} learnLinks={[{ title: 'Retry policies', url: 'https://learn.microsoft.com/x' }]} devtoUrl={null} />);
    expect(screen.getByRole('heading', { name: 'On Microsoft Learn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Retry policies' })).toHaveAttribute('href', 'https://learn.microsoft.com/x');
  });

  it('renders nothing with no articles and no dev.to url', () => {
    const { container } = render(<RecapLinks relatedArticles={[]} devtoUrl={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
