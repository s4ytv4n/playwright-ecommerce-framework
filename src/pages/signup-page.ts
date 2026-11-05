import type { Locator, Page } from '@playwright/test';
import type { User } from '@models/user';
import { BasePage } from './base-page';

/** Second signup step: "Enter Account Information". */
export class SignupPage extends BasePage {
  readonly form: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page, '/signup');
    this.form = page.locator('form[action="/signup"]');
    this.nameField = page.locator('[data-qa="name"]');
    this.emailField = page.locator('[data-qa="email"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');
  }

  private field(qa: string): Locator {
    return this.page.locator(`[data-qa="${qa}"]`);
  }

  async fillAccountInformation(user: User): Promise<void> {
    await this.page.locator(user.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await this.field('password').fill(user.password);
    await this.field('days').selectOption(user.birthDay);
    await this.field('months').selectOption(user.birthMonth);
    await this.field('years').selectOption(user.birthYear);

    await this.field('first_name').fill(user.firstName);
    await this.field('last_name').fill(user.lastName);
    await this.field('company').fill(user.company);
    await this.field('address').fill(user.address1);
    await this.field('address2').fill(user.address2);
    await this.field('country').selectOption(user.country);
    await this.field('state').fill(user.state);
    await this.field('city').fill(user.city);
    await this.field('zipcode').fill(user.zipcode);
    await this.field('mobile_number').fill(user.mobileNumber);
  }

  async createAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
