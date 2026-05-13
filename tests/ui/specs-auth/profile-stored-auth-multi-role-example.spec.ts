import { test } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import pages from '../../utils/pages';

/**
 * This file demonstrates how we can create multiple contexts within one test
 * - This allows us to run two tests simultaneously with two different users
 * - Remember, your application must be able to handle multiple sessions/users!
 * - FOR OUR DEMO APPLICATION, THIS TEST DOESN'T WORK
 */

let profilePage: ProfilePage;

// auth-setup has already run, so we have already logged in as the admin and user!
test.beforeEach(async ({ page }) => {
    await page.goto(pages.profile);
});

test.describe('Book Store Application - Profile - Admin', () => {
    test('admin and user', async ({ browser }) => {
        // Create new admin context/browser
        const adminContext = await browser.newContext({ storageState: '.auth/admin.json' });
        const adminPage = await adminContext.newPage(); // Create a new page within the browser
        profilePage = new ProfilePage(adminPage);
        await profilePage.checkLoggedInAdmin();
        
        // Create new user context/browser
        const userContext = await browser.newContext({ storageState: '.auth/user.json' });
        const userPage = await userContext.newPage(); // Create a new page within the browser
        profilePage = new ProfilePage(userPage);
        await profilePage.checkLoggedInUser();
        
        await adminContext.close();
        await userContext.close();
    });
});
