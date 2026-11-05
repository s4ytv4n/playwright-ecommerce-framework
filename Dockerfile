# Runs the whole suite in the official Playwright image (browsers + OS deps preinstalled).
# Keep the tag in sync with @playwright/test in package.json.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
