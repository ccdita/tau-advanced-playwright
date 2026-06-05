import { test, type Page, type BrowserContext } from '@playwright/test';
import ProfilePage from '../pages/profile-page';
import apiPaths from '../../utils/apiPaths';
import pages from '../../utils/pages';

let profilePage: ProfilePage;

test.beforeEach(async ({ page }) => {
    await page.goto(pages.profile);
    profilePage = new ProfilePage(page);
});

test.describe('Profile - API Interception', () => {
    test('Sort books', async ({ page, context }) => { 
        // Mock API response to have a predictable list of books for testing sorting functionality
        await watchAPICallAndMockResponse(page, context);
        await profilePage.checkBooksList();
        await profilePage.sortBooksList();
        await profilePage.checkSort();
    });
});

/**
 * Mocks the API response for the books list and waits for the API call to complete before proceeding with the test
 * 
 * @param page, the Playwright driver
 * @param context, the Playwright browser context to set up API interception
 */
async function watchAPICallAndMockResponse(page: Page, context: BrowserContext) {
    await profilePage.mockBooksListResponse(context); // Set up API interception to mock the books list response
    // Wait for the response and reload simultaneously to ensure the page has the mocked data before proceeding
    const [response] = await Promise.all([
        // Call the API via the URL, which will return a mocked response due to the interception set up in profilePage.mockBooksListResponse
        page.waitForResponse(new RegExp(apiPaths.account)),  // Wait until a response URL matches the regex then return the response object for further processing
        await page.reload(), // Trigger the reload to call the API and capture the response when it arrives
    ]);
    await response.json(); // Parse the response body as JSON to ensure that the mocked data is properly loaded
}
