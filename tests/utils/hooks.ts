import { Page } from '@playwright/test';
import { buildUrl } from './uiUrlBuilder';
import BookPage from '../ui/pages/book-page';
import LoginPage from '../ui/pages/login-page';
import ProfilePage from '../ui/pages/profile-page';

/**
 * Navigates to a specified URL and instantiates a page object
 * - Simplifies page object creation
 * 
 * @param page, the Playwright driver
 * @param PageObjectParam, the page object to instantiate
 * @param targetPage, a string indicating the path of the target page
 * @param params, any additional params (optional)
 * @returns a page object to be used by other tests
 */
async function beforeEach( // Function can be named anything
  page: Page,
  PageObjectParam: LoginPage|BookPage|ProfilePage,
  targetPage: string,
  params?: Record<any, any>
) {
  // Build a URL with the given target page path and any search parameters, then navigate to the URL
  await page.goto(buildUrl(targetPage, params));
  const pageObject = await new PageObjectParam(page);
  // Can add other code here
  return pageObject;
}

export default { beforeEach };
