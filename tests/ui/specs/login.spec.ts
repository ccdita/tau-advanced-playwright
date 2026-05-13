import { test } from '@playwright/test';
import LoginPage from '../pages/login-page';
import pages from '../../utils/pages';
import userData from '../../data/user-data';

const userName = process.env.DEMOQA_USERNAME!;
const password = process.env.DEMOQA_PASSWORD!;
let loginPage: LoginPage;

/**
 * login.spec.ts and login-page.ts are examples of logging in manually. In testing applications, we repeat these steps
 * for every test. To see a demonstration of how Playwright can restore the login state so that we do not need to repeat
 * these steps for every single test, see profile-stored-authentication.spec.ts and profile-page.ts
 */

/**
 * Makes the storage state empty so that it does not load in the log-in state
 */
test.use({ storageState: { cookies: [], origins: [] } }); // doesn't share the logged in session
// Alternative way
// test.use({ storageState: undefined }); // https://github.com/microsoft/playwright/issues/17396
/**
 * Execute tests sequentially instead of in parallel, since multiple concurrent tests using the same session can cause the
 * tests to fail
 */
test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.goto(pages.loginPage); // Navigate to the login page before each test
  loginPage = new LoginPage(page); // Create a POM of the login page
});

// Test scenario with positive and negative test cases
test.describe('Book Store - Login', () => {
  test(`successfull login`, async () => {
    await loginPage.doLogin(userName, password);
    await loginPage.checkLoggedIn();
  });

  test(`failing login - invalid username`, async () => {
    const invalidUsername = userData.invalidUsername;
    await loginPage.doLogin(invalidUsername, password);
    await loginPage.checkInvalidCredentials();
  });

  test(`failing login - invalid password`, async () => {
    const invalidPassword = userData.invalidPassword;
    await loginPage.doLogin(userName, invalidPassword);
    await loginPage.checkInvalidCredentials();
  });
});

