import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment?: { name: string; mimeType: string; buffer: Buffer };
}

export class ContactUsPage extends BasePage {
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly subjectField: Locator;
  readonly messageField: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page, '/contact_us');
    this.nameField = page.locator('[data-qa="name"]');
    this.emailField = page.locator('[data-qa="email"]');
    this.subjectField = page.locator('[data-qa="subject"]');
    this.messageField = page.locator('[data-qa="message"]');
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = page.locator('.contact-form .status.alert-success');
  }

  async submit(contact: ContactMessage): Promise<void> {
    await this.nameField.fill(contact.name);
    await this.emailField.fill(contact.email);
    await this.subjectField.fill(contact.subject);
    await this.messageField.fill(contact.message);
    if (contact.attachment) {
      await this.fileInput.setInputFiles(contact.attachment);
    }
    // The store asks for confirmation with a native confirm() dialog.
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}
