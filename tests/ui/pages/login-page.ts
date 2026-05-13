import { type Page, type Locator , expect } from '@playwright/test';
import messages from '../../utils/messages';

/**
 * login.spec.ts and login-page.ts are examples of logging in manually. In testing applications, we repeat these steps
 * for every test. To see a demonstration of how Playwright can restore the login state so that we do not need to repeat
 * these steps for every single test, see profile-stored-authentication.spec.ts and profile-page.ts
 */

class LoginPage {
  // Variables
  readonly page: Page;
  readonly loginButton: Locator;
  readonly messagePanel: Locator;
  readonly password: Locator;
  readonly userName: Locator;

  /**
   * Constructs a LoginPage POM instance
   * @param page to construct POM instance from
   */
  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.messagePanel = page.locator('#output'); // Get element with ID 'output'
    this.password = page.getByPlaceholder('Password');
    this.userName = page.getByPlaceholder('UserName');
  }

  /**
   * Fills the username field with the given email
   * @param email to fill the field with
   */
  async fillEmail(email: string) {
    await this.userName.fill(email);
  }

  /**
   * Fills the password field with the given password
   * @param password to fill the field with
   */
  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  /**
   * Completes the login flow
   * @param email to log in with
   * @param password to log in with
   */
  async doLogin(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
  }

  /**
   * Checks for a successful login
   */
  async checkLoggedIn() {
    await expect(this.page).toHaveURL(/.*profile/);
    await expect(this.page).toHaveTitle('demosite');
  }

  /**
   * Checks for an invalid login
   */
  async checkInvalidCredentials() {
    await expect(this.messagePanel).toHaveText(messages.login.invalid);
  }
}

export default LoginPage;
