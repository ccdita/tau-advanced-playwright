import { test as base } from '@playwright/test';
import BookPage from '../pages/book-page';
import hooks from '../../utils/hooks';
import pages from '../../utils/pages';

/**
 * Indicates that:
 * - MyFixtures is a custom type name
 * - Any object of type MyFixtures must have:
 *     - A property called bookPage
 *     - whose value must be of type BookPage
 */
type MyFixtures = {
  bookPage: BookPage;
}

/**
 * Indicates that:
 * - Duplicate is a custom type name
 * - Any object of type Duplicate must have:
 *     - A property called isDupe
 *     - whose value must be of type boolean
 */
export type Duplicate = {
  isDupe: boolean;
}

/**
 * - MyFixtures & Duplicate = Typescript combines all of their properties
 * into a final fixture object
 * - base.extend<MyFixtures & Duplicate> gives Typescript assurance that both fixtures will be 
 * provided by the test environment
 * - Overall, allows this file to communicate with the test file
 */
export const test = base.extend<MyFixtures & Duplicate>({

  isDupe: false, // Default boolean value

  // bookPage is a custom fixture
  bookPage: async ({ page, isDupe }, use) => {
    // Instantiate a BookPage object
    const bookPage = await hooks.beforeEach(page, BookPage, pages.bookStorePage);
    
    await use(bookPage); // Execute code in test file
    
    // After the test file code is executed, return to this fixture and execute below
    await bookPage.addToYourCollection(isDupe); 
  },
});

export { expect } from '@playwright/test';