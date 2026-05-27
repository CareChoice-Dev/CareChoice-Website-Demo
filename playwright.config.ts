import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

// When A11Y_BASE_URL points at a remote deploy, skip spinning up a local dev
// server entirely (avoids the Payload schema-push prompt that hangs `next dev`).
const remoteTarget =
  !!process.env.A11Y_BASE_URL && !process.env.A11Y_BASE_URL.includes('localhost')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // For remote targets (A11Y_BASE_URL set to a deploy), no local server needed.
  webServer: remoteTarget
    ? undefined
    : {
        command: 'pnpm dev',
        reuseExistingServer: true,
        url: 'http://localhost:3000',
        // Note: `pnpm dev` can hang on the Payload schema-push prompt. With
        // `reuseExistingServer: true` Playwright skips the spawn when a server
        // is already listening — start `npm run dev` manually first, or target
        // a deploy with A11Y_BASE_URL to skip the local server altogether.
      },
})
