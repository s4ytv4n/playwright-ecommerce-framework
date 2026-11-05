import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/test';

test.describe('Contact us', () => {
  test('customer can send a message with an attachment', async ({ contactUsPage }) => {
    await contactUsPage.open();

    await contactUsPage.submit({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: 'Order question',
      message: faker.lorem.paragraph(),
      attachment: {
        name: 'order-details.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Order #12345 - delivery question'),
      },
    });

    await expect(contactUsPage.successMessage).toHaveText(
      'Success! Your details have been submitted successfully.',
    );
  });
});
