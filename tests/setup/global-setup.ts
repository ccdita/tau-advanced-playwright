import { chromium, FullConfig } from '@playwright/test';
import LoginPage from '../ui/pages/login-page';
import uiPages from '../utils/uiPages';

/**
 * Performs sign-in and generates a JSON file that contains the sign-in state to be reused across other tests
 * - This file is run once per run (every time you trigger a test, global setup will run)
 * - This file can be stored in a server or local machine if it is running for every run. If that is the case,
 * you need to have a way to save the log-in session on the machine where tests are being run
 * 
 * @param config, to be used to connect to the playwright.config.ts file
 */
async function globalSetup(config: FullConfig) {
  // Use DEMOQA_USERNAME instead of USERNAME since USERNAME is already an environment variable on Windows!
  const user = process.env.DEMOQA_USERNAME!;
  const password = process.env.DEMOQA_PASSWORD!;
  /**
   * Get the baseURL and storageState
   * Similar to:
   * const baseURL = config.projects[0].use.baseURL;
   * const storageState = config.projects[0].use.storageState;
   */
  const { baseURL, storageState } = config.projects[0].use;
  // Launch Chrome in headless mode since we are just signing in (you can use other browsers)
  const browser = await chromium.launch({ headless: true, timeout: 10000 });
  const page = await browser.newPage(); // Open a new tab/page within the browser instance
  /**
   * It is OK to instantiate a new LoginPage object before going to the login page, since the object is just a wrapper
   * around the Playwright page object (it doesn't immediately interact with the website when it's created)
   * - The object simly stores the page references and intializes locators and functions (which are inherently lazy)
   */
  const loginPage = new LoginPage(page); // Create a new LoginPage object

  await page.goto(baseURL+uiPages.login); // Navigate to the login page
  await loginPage.doLogin(user, password); 
  await loginPage.checkLoggedIn(); // Check that the user is logged in
  await page.context().storageState({ path: storageState as string }); // Store log-in state
  await browser.close();
}

export default globalSetup;

/**
 * Useful documentation for working with Trace Viewer
 * - If the test fails in global-setup, it will not trace anything
 * - Implement a Trace Viewer to capture trace of failures during global setup
 */
// https://playwright.dev/docs/test-global-setup-teardown#capturing-trace-of-failures-during-global-setup
// https://playwright.dev/docs/trace-viewer
