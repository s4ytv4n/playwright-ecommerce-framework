/** A product line as shown in the listing or in the cart. Prices are in whole rupees. */
export interface ProductLine {
  name: string;
  price: number;
  quantity?: number;
  total?: number;
}
