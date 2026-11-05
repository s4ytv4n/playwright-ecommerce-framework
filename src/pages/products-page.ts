import type { Locator, Page } from '@playwright/test';
import type { ProductLine } from '@models/product';
import { parsePrice } from '@utils/price';
import { BasePage } from './base-page';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sectionTitle: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page, '/products');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.sectionTitle = page.locator('.features_items h2.title');
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.productCards.locator('.productinfo p').allTextContents();
    return names.map((name) => name.trim());
  }

  async getProduct(index: number): Promise<ProductLine> {
    const info = this.productCards.nth(index).locator('.productinfo');
    return {
      name: (await info.locator('p').innerText()).trim(),
      price: parsePrice(await info.locator('h2').innerText()),
    };
  }

  /** Adds the n-th card to the cart and returns what was added, for later assertions. */
  async addToCart(index: number): Promise<ProductLine> {
    const product = await this.getProduct(index);
    await this.productCards.nth(index).locator('.productinfo a.add-to-cart').click();
    return product;
  }
}
