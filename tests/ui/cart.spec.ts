import { test, expect } from '@fixtures/test';

test.describe('Shopping cart', () => {
  test('products added from the listing appear in the cart with correct prices @smoke', async ({
    productsPage,
    cartModal,
    cartPage,
  }) => {
    await productsPage.open();

    const first = await productsPage.addToCart(0);
    await expect(cartModal.title).toHaveText('Added!');
    await cartModal.continueShopping();

    const second = await productsPage.addToCart(1);
    await cartModal.viewCart();

    await expect(cartPage.rows).toHaveCount(2);
    expect(await cartPage.getItems()).toEqual([
      { ...first, quantity: 1, total: first.price },
      { ...second, quantity: 1, total: second.price },
    ]);
  });

  test('quantity chosen on the product page is carried to the cart and totals are correct', async ({
    productDetailsPage,
    cartModal,
    cartPage,
  }) => {
    const quantity = 4;
    await productDetailsPage.openProduct(1);
    const product = await productDetailsPage.getProduct();

    await productDetailsPage.addToCart(quantity);
    await cartModal.viewCart();

    expect(await cartPage.getItems()).toEqual([
      { ...product, quantity, total: product.price * quantity },
    ]);
  });

  test('removing the only product empties the cart', async ({ productsPage, cartModal, cartPage }) => {
    await productsPage.open();
    const product = await productsPage.addToCart(0);
    await cartModal.viewCart();

    await cartPage.removeItem(product.name);

    await expect(cartPage.rows).toHaveCount(0);
    await expect(cartPage.emptyCartMessage).toContainText('Cart is empty!');
  });

  test('cart is kept after the customer logs in', async ({
    loginPage,
    productsPage,
    cartModal,
    cartPage,
    registeredUser,
  }) => {
    await productsPage.open();
    const product = await productsPage.addToCart(2);
    await cartModal.continueShopping();

    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await expect(loginPage.header.loggedInAs).toBeVisible();

    await cartPage.open();
    await expect(cartPage.row(product.name)).toBeVisible();
  });
});
