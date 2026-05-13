import { test } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import pages from '../../utils/pages';

/**
 * profile-stored-authentication.spec.ts and profile-page.ts are examples of how Playwright restores the log-in state
 * so that we do not have to manually (and repeatedly) sign in for every single test (as demonstrated in login.spec.ts
 * and login-page.ts)
 */

let profilePage: ProfilePage;

// globalSetup has already run prior to beforeEach! So, we have already signed in and saved the sign-in state
test.beforeEach(async ({ page }) => {
    // Playwright combines the baseURL from the config with the path provided here (baseURL + relative path)
    await page.goto(pages.profile); 
    profilePage = new ProfilePage(page);
});

test.describe('Profile - Stored Auth', () => {
    test('Check logged in', async () => {
        await profilePage.checkLoggedIn();
    });
});
