import { test, expect } from '@fixtures/test';
import { UserFactory } from '@data/user-factory';
import { LoginPage } from '@pages/login-page';

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('new customer can register and delete the account @smoke @e2e', async ({
    page,
    api,
    loginPage,
    signupPage,
    accountStatusPage,
  }) => {
    const user = UserFactory.create();

    try {
      await test.step('Start signup with name and email', async () => {
        await loginPage.startSignup(user.name, user.email);
        await expect(signupPage.nameField).toHaveValue(user.name);
        await expect(signupPage.emailField).toHaveValue(user.email);
      });

      await test.step('Fill account information and create the account', async () => {
        await signupPage.fillAccountInformation(user);
        await signupPage.createAccount();
        await expect(accountStatusPage.accountCreatedTitle).toBeVisible();
      });

      await test.step('Customer is logged in after continuing', async () => {
        await accountStatusPage.continue();
        await expect(loginPage.header.loggedInAs).toContainText(user.name);
      });

      await test.step('Account is persisted with the entered data (checked via API)', async () => {
        const details = await api.getUserByEmail(user.email);
        expect(details.responseCode).toBe(200);
        expect(details.body).toMatchObject({
          user: { email: user.email, first_name: user.firstName, last_name: user.lastName, city: user.city },
        });
      });

      await test.step('Delete the account from the UI', async () => {
        await loginPage.header.deleteAccount();
        await expect(accountStatusPage.accountDeletedTitle).toBeVisible();
        await expect(page).toHaveURL(/delete_account/);
      });
    } finally {
      // Safety net: if any step failed, do not leave the account behind.
      await api.deleteAccount(user.email, user.password);
    }
  });

  test('registered customer can log in and log out @smoke', async ({ page, loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, registeredUser.password);
    await expect(loginPage.header.loggedInAs).toContainText(registeredUser.name);

    await loginPage.header.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.header.signupLoginLink).toBeVisible();
  });

  test('login with a wrong password is rejected @negative', async ({ loginPage, registeredUser }) => {
    await loginPage.login(registeredUser.email, `${registeredUser.password}-wrong`);

    await expect(loginPage.loginError).toHaveText('Your email or password is incorrect!');
    await expect(loginPage.header.loggedInAs).toBeHidden();
  });

  test('signup with an already registered email is rejected @negative', async ({ loginPage, registeredUser }) => {
    await loginPage.startSignup('Another Name', registeredUser.email);

    await expect(loginPage.signupError).toHaveText('Email Address already exist!');
  });

  test('login form does not submit with empty fields @negative', async ({ page, loginPage }) => {
    await loginPage.loginButton.click();

    expect(await LoginPage.isValueMissing(loginPage.loginEmail)).toBe(true);
    expect(await LoginPage.isValueMissing(loginPage.loginPassword)).toBe(true);
    await expect(page).toHaveURL(/\/login$/);
  });
});
