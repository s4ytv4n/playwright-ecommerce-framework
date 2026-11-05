import type { Locator, Page } from '@playwright/test';

/** "Added!" confirmation shown after adding a product to the cart. */
export class CartModal {
  readonly root: Locator;
  readonly title: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('#cartModal');
    this.title = this.root.locator('.modal-title');
    this.viewCartLink = this.root.locator('a[href="/view_cart"]');
    this.continueShoppingButton = this.root.locator('button.close-modal');
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.root.waitFor({ state: 'hidden' });
  }

  async viewCart(): Promise<void> {
    await this.viewCartLink.click();
  }
}
