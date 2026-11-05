import type { Locator, Page } from '@playwright/test';
import type { ProductLine } from '@models/product';
import { parsePrice } from '@utils/price';
import { BasePage } from './base-page';

export class ProductDetailsPage extends BasePage {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page, '/product_details');
    const info = page.locator('.product-information');
    this.name = info.locator('h2');
    this.price = info.locator('span > span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = info.locator('button.cart');
  }

  async openProduct(id: number): Promise<void> {
    await this.page.goto(`${this.path}/${id}`);
  }

  async getProduct(): Promise<ProductLine> {
    return {
      name: (await this.name.innerText()).trim(),
      price: parsePrice(await this.price.innerText()),
    };
  }

  async addToCart(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }
}
