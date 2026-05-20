import { test } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import hooks from '../../utils/hooks';
import pages from '../../utils/pages';

let profilePage: ProfilePage;

test.beforeEach(async ({ page }) => {
    // await page.goto(pages.profile); // Go to the profile page before each test
    // profilePage = new ProfilePage(page); // Instantiate a ProfilePage object with the page object
    
    /**
     * Accomplishes the same thing as above, except in one line = faster development!
     */
    profilePage = await hooks.beforeEach(page, ProfilePage, pages.profile);
});

test.describe('Profile - Dynamic Page Object Model', () => {
    test('Check logged in', async () => {
        await profilePage.checkLoggedIn();
    });
});
