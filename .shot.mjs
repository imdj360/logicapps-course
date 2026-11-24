import { chromium } from '@playwright/test';
const [,, url, out, w, h, scheme] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, colorScheme: scheme });
await p.goto(url); await p.waitForTimeout(1800);
await p.screenshot({ path: out });
await b.close();
