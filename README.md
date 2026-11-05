# Playwright E-commerce Test Framework

[![Playwright Tests](https://github.com/s4ytv4n/playwright-ecommerce-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/s4ytv4n/playwright-ecommerce-framework/actions/workflows/playwright.yml)
[![Test report](https://img.shields.io/badge/report-latest-2ea44f)](https://s4ytv4n.github.io/playwright-ecommerce-framework/)

UI and API test automation for an online store, written in **TypeScript with Playwright**.
The target is the public demo shop [automationexercise.com](https://automationexercise.com), which has a real
signup, catalogue, search, cart and a REST API, so both layers can be tested end to end.

The structure follows the frameworks I build and maintain for production **Magento 2** stores
(B2C/B2B, multi-store for DE, IT and Scandinavian markets). That client code is private;
this repository shows the same approach on a public target.

## What is covered

| Area | UI tests | API tests |
|---|---|---|
| Registration & login | full signup flow, login/logout, wrong password, duplicate email, required fields | create → verify → read → update → delete lifecycle, 400/404/405 cases |
| Catalogue & search | product listing, data-driven search, empty search | product and brand lists validated with **zod** schemas, search, unsupported methods |
| Cart | add from listing, quantity from product page, totals, remove item, cart kept after login | |
| Contact form | submission with file upload and native dialog | |

## Design decisions

- **Page Object + components.** Pages own their URL and locators; shared parts (header, add-to-cart modal) are separate components. Tests read as business steps, not selectors.
- **Fixtures instead of `beforeEach` boilerplate.** Page objects, the API client and test data are injected by a single `test` from `src/fixtures/test.ts`.
- **API for setup, UI for the check.** The `registeredUser` fixture creates an account through the API and deletes it afterwards, even when the test fails. UI tests start from the state they need in milliseconds and leave no test data behind.
- **UI ↔ API consistency checks.** Search results and the catalogue shown in the browser are compared with what the API returns, so expected data is never hard-coded and tests survive catalogue changes.
- **Contract checks with zod.** API responses are parsed against schemas; any missing field or wrong type fails with a precise message.
- **Stable by design.** Ads, trackers and the consent banner are blocked at network level (the main cause of flaky clicks on this site); web-first assertions everywhere, no fixed waits.
- **Unique test data.** `UserFactory` (faker) generates collision-free users, so tests run fully in parallel.
- **Tags** (`@smoke`, `@negative`, `@e2e`) for targeted runs.

## Tech stack

Playwright · TypeScript · zod · faker · ESLint (typescript-eslint + eslint-plugin-playwright) · GitHub Actions · GitHub Pages · Docker

## Project structure

```
src/
  api/          StoreApi client and zod response schemas
  config/       environment settings with safe defaults
  data/         test data factories
  fixtures/     extended Playwright test with injected pages, API client and users
  models/       domain types
  pages/        page objects and shared components
  utils/        helpers (price parsing, third-party request blocking)
tests/
  api/          API tests (no browser)
  ui/           UI tests
```

## Running locally

Requirements: Node.js 20+.

```bash
npm ci
npx playwright install chromium

npm test                 # everything (API + Chromium + Firefox)
npm run test:api         # API only
npm run test:ui          # UI in Chromium
npm run test:smoke       # @smoke tests only
npm run test:headed      # watch the browser
npm run report           # open the last HTML report
```

No configuration is required. To point the suite elsewhere or tune execution, copy `.env.example` to `.env`.

Run in Docker:

```bash
docker build -t pw-ecommerce .
docker run --rm --ipc=host pw-ecommerce
```

## CI

Every push and pull request runs lint, type check, API tests and Chromium UI tests.
A scheduled daily run catches changes on the live site. The HTML report (with traces, screenshots
and videos of failures) is published to [GitHub Pages](https://s4ytv4n.github.io/playwright-ecommerce-framework/).

## Author

**Ivan Saitarly** — QA Automation Engineer · Playwright/TypeScript · Selenium/Java/TestNG · API & load testing · E-commerce
