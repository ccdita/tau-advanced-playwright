import { type Page, type Locator , expect, type BrowserContext } from '@playwright/test';
import bookListData from '../../data/book-list-data';
import apiPaths from '../../utils/apiPaths';

/**
 * profile-stored-authentication.spec.ts and profile-page.ts are examples of how Playwright restores the log-in state
 * so that we do not have to manually (and repeatedly) sign in for every single test (as demonstrated in login.spec.ts
 * and login-page.ts)
 */

class SearchPage {
  readonly page: Page;
  readonly bookAdminLabel: Locator;
  readonly booksCollectionRequestRegExp: RegExp;
  readonly bookUserLabel: Locator;
  readonly gridRow1: Locator;
  readonly gridRow2: Locator;
  readonly notLoggedInLabel: Locator;
  readonly searchField: Locator;
  readonly titleHeaderLabel: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.bookAdminLabel = page.getByText('Eloquent JavaScript, Second Edition');
    this.booksCollectionRequestRegExp = new RegExp(apiPaths.account);
    this.bookUserLabel = page.getByText('Understanding ECMAScript 6');
    this.gridRow1 = page.locator('div:nth-child(1) > .rt-tr > div:nth-child(2)').last();
    this.gridRow2 = page.locator('div:nth-child(2) > .rt-tr > div:nth-child(2)');
    this.notLoggedInLabel = page.getByText('Currently you are not logged into the Book Store application, please visit the login page to enter or register page to register yourself.');
    this.searchField = page.getByPlaceholder('Type to search');
    this.titleHeaderLabel = page.getByText('Title');
  }

  async fillSearchField(q: string) {
    await this.searchField.fill(q);
  }

  async checkSearchResult(q: string, items: string) {
  }

  async checkBooksList() {
    for (const book of bookListData.books){
      await expect(this.page.getByRole('link', { name: book.title })).toBeVisible();
    }
  }

  async sortBooksList() {
    await this.titleHeaderLabel.click({ clickCount: 2 });
  }

  async checkLoggedIn() {
    await expect(this.notLoggedInLabel).not.toBeVisible();
    // await expect(this.notLoggedInLabel).toBeVisible();
  }

  async checkLoggedInUser() {
    await expect(this.notLoggedInLabel).not.toBeVisible();
    await expect(this.bookUserLabel).toBeVisible();
  }

  async checkLoggedInAdmin() {
    await expect(this.notLoggedInLabel).not.toBeVisible();
    await expect(this.bookAdminLabel).toBeVisible();
  }

  async checkSort() {
    await expect(this.gridRow1).toContainText(bookListData.books[1].title);
    await expect(this.gridRow2).toContainText(bookListData.books[0].title);
  }

  async getBooksList() {
  }

  /**
   * Mocks the API response for the books list to have a predictable list of books for testing sorting functionality
   * 
   * @param context, the Playwright browser context to set up API interception
   */
  async mockBooksListResponse(context: BrowserContext) {
    /**
     * Intercept the API call to the books collection endpoint and mock the response with the bookListData
     * - booksCollectionRequestRegExp = Account/v1/User/
     * - context.route registers a route handler that intercepts any request URL that matches this.booksCollectionRequestRegExp
     * - (route) => route.fulfill() runs whenever a matching request occurs, and route.fulfill() tells Playwright to return a custom response
     * - bookListData is spread into a new object to ensure that we are not mutating the original data when we mock the response, 
     * and then JSON.stringify is used to convert the JavaScript object into a JSON string, which is the expected format for the API response body
     */
    await context.route(this.booksCollectionRequestRegExp, (route) => route.fulfill({
      /**
       * Take all properties from bookListData and copy them into a new object literal (hence the curly braces)
       */
      body: JSON.stringify({...(bookListData)})
    }));
  }
}

export default SearchPage;
