export interface SiteConfig {
  siteUrl: string;
  devtoUrl: string | null;
  plausibleDomain: string | null;
  contactEmail: string | null;
}

type Env = Record<string, string | undefined>;

const read = (env: Env, key: string): string | null => {
  const value = env[key]?.trim();
  return value ? value : null;
};

export function getSiteConfig(env: Env = {}): SiteConfig {
  return {
    siteUrl: read(env, 'PUBLIC_SITE_URL') ?? 'http://localhost:4321',
    devtoUrl: read(env, 'PUBLIC_DEVTO_URL'),
    plausibleDomain: read(env, 'PUBLIC_PLAUSIBLE_DOMAIN'),
    contactEmail: read(env, 'PUBLIC_CONTACT_EMAIL'),
  };
}

export const siteConfig = getSiteConfig(import.meta.env);
