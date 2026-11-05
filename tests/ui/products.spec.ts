import { test, expect } from '@fixtures/test';

test.describe('Product catalogue', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  test('all products page lists the catalogue @smoke', async ({ productsPage }) => {
    await expect(productsPage.sectionTitle).toHaveText(/all products/i);
    await expect(productsPage.productCards.first()).toBeVisible();
    expect(await productsPage.productCards.count()).toBeGreaterThan(10);
  });

  test('catalogue in the UI matches the products API', async ({ productsPage, api }) => {
    const apiResult = await api.getProducts();
    const apiNames = (apiResult.body as { products: { name: string }[] }).products.map((p) => p.name.trim());

    const uiNames = await productsPage.getProductNames();

    expect(uiNames.sort()).toEqual(apiNames.sort());
  });

  // Data-driven: every term is checked against the search API, so expected results
  // are never hard-coded and the test survives catalogue changes.
  for (const term of ['top', 'jeans', 'dress', 'saree']) {
    test(`search for "${term}" shows the same products as the search API`, async ({ productsPage, api }) => {
      const apiResult = await api.searchProducts(term);
      const expected = (apiResult.body as { products: { name: string }[] }).products.map((p) => p.name.trim());
      expect(expected.length, `API returned no products for "${term}"`).toBeGreaterThan(0);

      await productsPage.search(term);

      await expect(productsPage.sectionTitle).toHaveText(/searched products/i);
      expect((await productsPage.getProductNames()).sort()).toEqual(expected.sort());
    });
  }

  test('search with no matches shows an empty result @negative', async ({ productsPage }) => {
    await productsPage.search('no-such-product-xyz');

    await expect(productsPage.sectionTitle).toHaveText(/searched products/i);
    await expect(productsPage.productCards).toHaveCount(0);
  });
});
