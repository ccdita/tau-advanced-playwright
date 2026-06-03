import { test } from '../fixtures/books-fixture'; // test is NOT imported from @playwright/test
import { APIRequestContext, Page } from '@playwright/test';
import baseAPIUrl from '../../utils/environmentBaseUrl';
import deleteBookAPIRequest from '../../api/requests/delete-books-collection';
import userData from '../../data/user-data';

test.describe.configure({ mode: 'serial' });

let apiContext: APIRequestContext;
const env = process.env.ENV!;
const password = process.env.PASSWORD!;
const userId = process.env.USERID!;
const userName = process.env.USERNAME!;

// The playwright fixture is used to create a new APIRequestContext before all tests run
test.beforeAll(async ({ playwright }) => {
    /**
     * APIRequestContext is used to make API calls, and it is created using the "request" object from Playwright
     * It allows you to send HTTP requests and receive responses, which is useful for testing APIs or performing setup/teardown tasks in your tests
     * playwright.request.newContext() creates a new APIRequestContext with the specified options, such as baseURL and extraHTTPHeaders
     */
    // apiContext = await playwright.request.newContext({ storageState: 'storageState.json' });
    apiContext = await playwright.request.newContext({
        baseURL: baseAPIUrl[env].api,
        extraHTTPHeaders: {
            // Different authorization methods
            // Authorization: `Basic ${apiToken}`,
            Authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`,
            // Authorization: `Basic ${env}`,

            // This header indicates that the client expects a JSON response from the server. It is used to specify the desired format of the response data
            Accept: 'application/json',
        },
    });
});

test.describe('Books - Fixture & API', () => {
    // The scope of use is file or describe
    test.use({ isDupe: false });
    // First thing that will happen is to call the fixture (page and bookPage) automatically. whenever the fixture has a "use" it goes back to the test and then go back to the fixture again when the test is done and execute any remaining commands
    /**
     * 1. Clean the books collection for the user by making an API call to delete all books associated with the userId. This ensures that the test starts with a clean slate, without any pre-existing books in the user's collection
     * 2. Navigate to the book page using the bookPage fixture, which is set up to handle the navigation and interactions with the book page. The test will go to the URL specified in userData.books.new, which is a book to be added to the collection
     * 3. After the test code is executed, it will return to the fixture and execute the remaining commands, which is adding the book to the collection using the addToYourCollection method of the bookPage fixture
     */
    test('Add brand new book', async ({ page, bookPage }) => {
        await cleanBooks(userId, page);
        await bookPage.goto(userData.books.new);
    });
});

/**
 * Cleans all books for a given user by making an API request to delete them
 * 
 * @param userId of the user whose books need to be deleted
 * @param page, the Playwright driver
 */
async function cleanBooks(userId: string, page: Page) {
    await deleteBookAPIRequest.deleteAllBooksByUser(apiContext, userId);
    // await page.reload();
};

/**
 * 1. import the fixture file instead of the @playwright/test
 * 2. as soon as you use "bookPage" as a param of the test, 
 *  the fixture will be called 
 * 3. In the fixture file, will create the POM
 * 4. Next step in the fixture is the function "use",
 *  so it goes back to the test file
 * 5. In the test file, it will execute all the commands,
 *  (cleanBooks and bookPage.goto)
 * 6. As the test ends, it goes back to the fixture
 *  and executes the first intruction after the "use"
 * 7. In the fixture file, executes "bookPage.addToYourCollection",
 *  passing the param definde in the describe 
 * (test.use({ isDupe: false });)
*/