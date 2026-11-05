import type { Locator, Page } from '@playwright/test';
import type { ProductLine } from '@models/product';
import { parsePrice } from '@utils/price';
import { BasePage } from './base-page';

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page, '/view_cart');
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.proceedToCheckoutButton = page.locator('.check_out');
  }

  row(productName: string): Locator {
    return this.rows.filter({
      has: this.page.locator('.cart_description h4 a', { hasText: productName }),
    });
  }

  async getItems(): Promise<ProductLine[]> {
    const items: ProductLine[] = [];
    for (const row of await this.rows.all()) {
      items.push({
        name: (await row.locator('.cart_description h4 a').innerText()).trim(),
        price: parsePrice(await row.locator('.cart_price p').innerText()),
        quantity: Number((await row.locator('.cart_quantity button').innerText()).trim()),
        total: parsePrice(await row.locator('.cart_total_price').innerText()),
      });
    }
    return items;
  }

  async removeItem(productName: string): Promise<void> {
    const row = this.row(productName);
    await row.locator('.cart_quantity_delete').click();
    await row.waitFor({ state: 'detached' });
  }
}
