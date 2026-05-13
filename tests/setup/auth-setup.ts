import { test as setup, type Page } from '@playwright/test';
import LoginPage from '../ui/pages/login-page';
import uiPages from '../utils/uiPages';

/**
 * Similar to globalSetup, except we have multiple paths, each for a specific
 * user or role
 */

/**
 * STORING AUTHENTICATION VIA API REQUESTS
 * - An alternative way to handle authentication, instead of doing it based on the UI is via API
 * - Useful because you don't need to load the UI, which can increase test runtime
 */
// const authFile = '.auth/user.json';
//
// setup('authenticate', async ({ request }) => {
//     // Send authentication request. Replace with your own
//     await request.post('https://github.com/login', { // Send data to the server
//         form: {
//             'user': 'user',
//             'password': 'password'
//         }
//     });
//     await request.storageState({ path: authFile }); // Capture authentication state
// });

const adminFile = '.auth/admin.json'; // Stores admin log-in state

/**
 * Logs in as an admin and stores the log-in state in the appropriate JSON file
 */
setup('authenticate as admin', async ({ page }) => {
  const user = process.env.USERNAME_ADMIN!;
  const password = process.env.DEMOQA_PASSWORD!;
  await doLogin(page, user, password);

  await page.context().storageState({ path: adminFile });
});

const userFile = '.auth/user.json'; // Stores user log-in state

/**
 * Logs in as a user and stores the log-in state in the appropriate JSON file
 */
setup('authenticate as user', async ({ page }) => {
    const user = process.env.USERNAME_USER!;
    const password = process.env.DEMOQA_PASSWORD!;
    await doLogin(page, user, password);
    await page.context().storageState({ path: userFile });
});

/**
 * Logs into the page
 * 
 * @param page object of log-in page
 * @param user, username to log in with
 * @param password to log in with
 */
async function doLogin(page: Page, user:string, password: string) {
    const baseURL = setup.info().project.use.baseURL!; // Gets baseURL in playwright.config.ts
    const loginPage = new LoginPage(page);
  
    await page.goto(baseURL!+uiPages.login);
    await loginPage.doLogin(user, password);
    await page.waitForURL(baseURL+uiPages.login);
    await loginPage.checkLoggedIn();
}
