import { test, expect } from '@fixtures/test';
import { userDetailSchema } from '@api/schemas';
import { UserFactory } from '@data/user-factory';

test.describe('Account API: full lifecycle', () => {
  // Steps depend on each other (create -> read -> update -> delete), so they run in order.
  test.describe.configure({ mode: 'serial' });

  const user = UserFactory.create();

  test.afterAll(async ({ api }) => {
    await api.deleteAccount(user.email, user.password);
  });

  test('create account @smoke', async ({ api }) => {
    const result = await api.createAccount(user);

    expect(result.responseCode).toBe(201);
    expect(result.message).toBe('User created!');
  });

  test('created credentials are accepted by verifyLogin', async ({ api }) => {
    const result = await api.verifyLogin({ email: user.email, password: user.password });

    expect(result.responseCode).toBe(200);
    expect(result.message).toBe('User exists!');
  });

  test('user details contain the data sent on creation', async ({ api }) => {
    const result = await api.getUserByEmail(user.email);

    expect(result.responseCode).toBe(200);
    const details = userDetailSchema.parse(result.body).user;
    expect(details).toMatchObject({
      name: user.name,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      company: user.company,
      country: user.country,
      city: user.city,
      zipcode: user.zipcode,
    });
  });

  test('update account changes the stored data', async ({ api }) => {
    const updated = { ...user, city: 'Plovdiv', company: 'Updated Company Ltd' };

    const result = await api.updateAccount(updated);
    expect(result.responseCode).toBe(200);
    expect(result.message).toBe('User updated!');

    const details = userDetailSchema.parse((await api.getUserByEmail(user.email)).body).user;
    expect(details).toMatchObject({ city: 'Plovdiv', company: 'Updated Company Ltd' });
  });

  test('delete account, after which the login is rejected', async ({ api }) => {
    const deleted = await api.deleteAccount(user.email, user.password);
    expect(deleted.responseCode).toBe(200);
    expect(deleted.message).toBe('Account deleted!');

    const login = await api.verifyLogin({ email: user.email, password: user.password });
    expect(login.responseCode).toBe(404);
  });
});

test.describe('Account API: validation', () => {
  test('verifyLogin with unknown credentials returns 404 @negative', async ({ api }) => {
    const result = await api.verifyLogin({ email: 'nobody.qa@example.com', password: 'wrong-password' });

    expect(result.responseCode).toBe(404);
    expect(result.message).toBe('User not found!');
  });

  test('verifyLogin without email is a bad request @negative', async ({ api }) => {
    const result = await api.verifyLogin({ password: 'any-password' });

    expect(result.responseCode).toBe(400);
    expect(result.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('DELETE /verifyLogin is not supported @negative', async ({ api }) => {
    const result = await api.send('DELETE', '/verifyLogin');

    expect(result.responseCode).toBe(405);
    expect(result.message).toBe('This request method is not supported.');
  });

  test('creating an account with an existing email is rejected @negative', async ({ api, registeredUser }) => {
    const result = await api.createAccount(UserFactory.create({ email: registeredUser.email }));

    expect(result.responseCode).toBe(400);
    expect(result.message).toBe('Email already exists!');
  });
});
