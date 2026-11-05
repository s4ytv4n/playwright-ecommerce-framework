import type { Page } from '@playwright/test';

/**
 * Ad, analytics and consent-banner hosts used by the demo store.
 * They add nothing to the functional checks, slow pages down and inject
 * full-screen overlays that intercept clicks, which is the #1 source of flakiness here.
 */
const THIRD_PARTY_NOISE =
  /googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google|google-analytics\.com|googletagmanager\.com|fundingchoicesmessages\.google\.com|amazon-adsystem\.com/;

export async function blockThirdPartyNoise(page: Page): Promise<void> {
  await page.route(THIRD_PARTY_NOISE, (route) => route.abort());
}
