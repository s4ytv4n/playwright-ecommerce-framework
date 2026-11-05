import { test, expect } from '@fixtures/test';
import { brandsListSchema, productsListSchema } from '@api/schemas';

test.describe('Products API', () => {
  test('GET /productsList returns the catalogue matching the schema @smoke', async ({ api }) => {
    const result = await api.getProducts();

    expect(result.responseCode).toBe(200);
    const { products } = productsListSchema.parse(result.body);

    const ids = products.map((p) => p.id);
    expect(new Set(ids).size, 'product ids must be unique').toBe(ids.length);
  });

  test('POST /productsList is not supported @negative', async ({ api }) => {
    const result = await api.send('POST', '/productsList');

    expect(result.responseCode).toBe(405);
    expect(result.message).toBe('This request method is not supported.');
  });

  test('GET /brandsList returns brands matching the schema @smoke', async ({ api }) => {
    const result = await api.getBrands();

    expect(result.responseCode).toBe(200);
    brandsListSchema.parse(result.body);
  });

  test('PUT /brandsList is not supported @negative', async ({ api }) => {
    const result = await api.send('PUT', '/brandsList');

    expect(result.responseCode).toBe(405);
    expect(result.message).toBe('This request method is not supported.');
  });

  test('POST /searchProduct returns only products that are part of the catalogue', async ({ api }) => {
    const [search, all] = await Promise.all([api.searchProducts('top'), api.getProducts()]);

    expect(search.responseCode).toBe(200);
    const found = productsListSchema.parse(search.body).products;
    const catalogueIds = new Set(productsListSchema.parse(all.body).products.map((p) => p.id));

    for (const product of found) {
      expect(catalogueIds.has(product.id), `${product.name} is not in the catalogue`).toBe(true);
    }
  });

  test('POST /searchProduct without the search parameter is a bad request @negative', async ({ api }) => {
    const result = await api.searchProducts();

    expect(result.responseCode).toBe(400);
    expect(result.message).toBe('Bad request, search_product parameter is missing in POST request.');
  });
});
