import { test as base, expect } from '@playwright/test';
import { StoreApi } from '@api/store-api';
import { UserFactory } from '@data/user-factory';
import type { User } from '@models/user';
import { AccountStatusPage } from '@pages/account-status-page';
import { CartPage } from '@pages/cart-page';
import { CartModal } from '@pages/components/cart-modal';
import { ContactUsPage } from '@pages/contact-us-page';
import { LoginPage } from '@pages/login-page';
import { ProductDetailsPage } from '@pages/product-details-page';
import { ProductsPage } from '@pages/products-page';
import { SignupPage } from '@pages/signup-page';
import { blockThirdPartyNoise } from '@utils/block-third-party';

type Fixtures = {
  api: StoreApi;
  /** A fresh account created through the API before the test and deleted after it. */
  registeredUser: User;

  loginPage: LoginPage;
  signupPage: SignupPage;
  accountStatusPage: AccountStatusPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  cartModal: CartModal;
  contactUsPage: ContactUsPage;
};

export const test = base.extend<Fixtures>({
  // Every UI test gets a page with ads, trackers and the consent banner blocked.
  page: async ({ page }, use) => {
    await blockThirdPartyNoise(page);
    await use(page);
  },

  api: async ({ request }, use) => {
    await use(new StoreApi(request));
  },

  registeredUser: async ({ api }, use) => {
    const user = UserFactory.create();
    const created = await api.createAccount(user);
    expect(created.responseCode, `Precondition failed, createAccount said: ${created.message}`).toBe(201);

    await use(user);

    // Teardown runs even if the test failed, so no test accounts are left behind.
    await api.deleteAccount(user.email, user.password);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  accountStatusPage: async ({ page }, use) => use(new AccountStatusPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailsPage: async ({ page }, use) => use(new ProductDetailsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  cartModal: async ({ page }, use) => use(new CartModal(page)),
  contactUsPage: async ({ page }, use) => use(new ContactUsPage(page)),
});

export { expect };
