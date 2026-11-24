import { defineConfig, devices } from '@playwright/test';

const PORT = 4329;

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Astro 7 auto-backgrounds `preview` when it detects an AI agent env, which Playwright reads as "server exited".
    command: `PUBLIC_INCLUDE_FIXTURES=1 npm run build && env -u AI_AGENT -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT npx astro preview --port ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
