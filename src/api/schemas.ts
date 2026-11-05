import { z } from 'zod';

const category = z.object({
  usertype: z.object({ usertype: z.string().min(1) }),
  category: z.string().min(1),
});

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  price: z.string().regex(/^Rs\. \d+$/, 'price must look like "Rs. 500"'),
  brand: z.string().min(1),
  category,
});

export const productsListSchema = z.object({
  responseCode: z.literal(200),
  products: z.array(productSchema).min(1),
});

export const brandsListSchema = z.object({
  responseCode: z.literal(200),
  brands: z
    .array(z.object({ id: z.number().int().positive(), brand: z.string().min(1) }))
    .min(1),
});

export const userDetailSchema = z.object({
  responseCode: z.literal(200),
  user: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    email: z.email(),
    title: z.string(),
    birth_day: z.string(),
    birth_month: z.string(),
    birth_year: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    company: z.string(),
    address1: z.string(),
    address2: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    zipcode: z.string(),
  }),
});

export const messageSchema = z.object({
  responseCode: z.number().int(),
  message: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductsList = z.infer<typeof productsListSchema>;
export type BrandsList = z.infer<typeof brandsListSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
