import { describe, expect, it } from 'vitest';
import { getSiteConfig } from './site';

describe('getSiteConfig', () => {
  it('returns nulls and the local default for an empty env', () => {
    const c = getSiteConfig({});
    expect(c.siteUrl).toBe('http://localhost:4321');
    expect(c.plausibleDomain).toBeNull();
    expect(c.devtoUrl).toBeNull();
    expect(c.contactEmail).toBeNull();
  });

  it('reads the dev.to url', () => {
    expect(getSiteConfig({ PUBLIC_DEVTO_URL: 'https://dev.to/x' }).devtoUrl).toBe('https://dev.to/x');
  });

  it('treats empty strings as unset', () => {
    const c = getSiteConfig({ PUBLIC_SITE_URL: '', PUBLIC_PLAUSIBLE_DOMAIN: '  ', PUBLIC_CONTACT_EMAIL: '' });
    expect(c.siteUrl).toBe('http://localhost:4321');
    expect(c.plausibleDomain).toBeNull();
    expect(c.contactEmail).toBeNull();
  });
});
