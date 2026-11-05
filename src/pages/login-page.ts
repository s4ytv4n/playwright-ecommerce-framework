import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

/** /login hosts two forms side by side: existing-customer login and new-customer signup. */
export class LoginPage extends BasePage {
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly signupError: Locator;

  constructor(page: Page) {
    super(page, '/login');
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginError = page.locator('form[action="/login"] p');

    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupError = page.locator('form[action="/signup"] p');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  /** True when the browser blocks submission because a required field is empty. */
  static async isValueMissing(field: Locator): Promise<boolean> {
    return field.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
  }
}
