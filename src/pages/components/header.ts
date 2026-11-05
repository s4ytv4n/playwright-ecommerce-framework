import type { Locator, Page } from '@playwright/test';

export class Header {
  readonly nav: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;

  constructor(private readonly page: Page) {
    this.nav = page.locator('#header .shop-menu');
    this.homeLink = this.nav.locator('a[href="/"]');
    this.productsLink = this.nav.locator('a[href="/products"]');
    this.cartLink = this.nav.locator('a[href="/view_cart"]');
    this.signupLoginLink = this.nav.locator('a[href="/login"]');
    this.contactUsLink = this.nav.locator('a[href="/contact_us"]');
    this.logoutLink = this.nav.locator('a[href="/logout"]');
    this.deleteAccountLink = this.nav.locator('a[href="/delete_account"]');
    this.loggedInAs = this.nav.locator('li', { hasText: 'Logged in as' });
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async goToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}
