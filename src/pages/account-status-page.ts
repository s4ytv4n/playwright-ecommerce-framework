import type { Locator, Page } from '@playwright/test';

/** Confirmation screens shown after creating or deleting an account. */
export class AccountStatusPage {
  readonly accountCreatedTitle: Locator;
  readonly accountDeletedTitle: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.accountCreatedTitle = page.locator('[data-qa="account-created"]');
    this.accountDeletedTitle = page.locator('[data-qa="account-deleted"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
