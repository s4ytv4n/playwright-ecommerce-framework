import type { Page } from '@playwright/test';
import { Header } from './components/header';

/** Common parent for full pages: knows its own URL and owns the shared header. */
export abstract class BasePage {
  readonly header: Header;

  protected constructor(
    protected readonly page: Page,
    readonly path: string,
  ) {
    this.header = new Header(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }
}
