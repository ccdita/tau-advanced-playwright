import { test } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import pages from '../../utils/pages';

let profilePage: ProfilePage;

/**
 * Define file to store admin log-in state
 * - Can be defined at the beginning of the file for all tests, or inside the describe (see below)
 * - If using multiple different JSON files, your application must be able to support multiple sessions or users!
 */ 
test.use({ storageState: '.auth/admin.json' });

// auth-setup has already run, so we have already logged in as the admin!
test.beforeEach(async ({ page }) => {
    await page.goto(pages.profile);
});

test.describe('Book Store Application - Profile - Admin', () => {
    // test.use({ storageState: '.auth/admin.json' });
    test('Sort books - admin', async ( { page } ) => { 
        profilePage = new ProfilePage(page);
        await profilePage.checkLoggedInAdmin();
    });
});
