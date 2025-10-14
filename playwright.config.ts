import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/integration",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "Mobile Small - 320px",
      use: { ...devices["iPhone SE"], viewport: { width: 320, height: 568 } },
    },
    {
      name: "Mobile - 375px",
      use: { ...devices["iPhone 12"], viewport: { width: 375, height: 667 } },
    },
    {
      name: "Tablet - 768px",
      use: { ...devices["iPad"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "Desktop Small - 1024px",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "Desktop - 1440px",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "Desktop Large - 1920px",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
