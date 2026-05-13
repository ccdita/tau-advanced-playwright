import { defineConfig, devices } from '@playwright/test';
import baseEnvUrl from './tests/utils/environmentBaseUrl';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  /**
   * Define a file where sign-in logic will occur, and where a JSON file with the sign-in state will be created
   * to be reused across other tests
   * - Everything below will be applied as default for every project
   * - Commented out for multi-session tests, since globalSetup and storageState cannot be used simultaneously in
   * this file
   */
  // globalSetup: require.resolve('./tests/setup/global-setup'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: 'html',
  // timeout: 5000,
  use: {
    // storageState and baseURL will be used in global-setup.ts (line 19)
    // - Commented out for multi-session tests, since globalSetup and storageState cannot be used simultaneously in this file
    // storageState: 'storageState.json', // Define JSON file which stores the sign-in state
    trace: 'on',
    baseURL: process.env.ENV === 'production' 
      ? baseEnvUrl.production.home
      : process.env.ENV === 'staging' 
        ? baseEnvUrl.staging.home
        : baseEnvUrl.local.home
  },

  projects: [
    // For multi-session/multi-user tests, the file is auth-setup.ts
    { 
      name: 'auth-setup', 
      testMatch: /auth-setup\.ts/ 
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
       },
    },
    // For multi-session/multi-user tests
    {
      name: 'chromium-auth',
      use: { 
        ...devices['Desktop Chrome'] ,
        // storageState: '.auth/admin.json', //use this in case you have multiple projects one per user
      },
      dependencies: ['auth-setup'],
    },
  ],
});
