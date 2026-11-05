import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '@config/environment';
import type { User } from '@models/user';

/**
 * The demo API always answers with HTTP 200 and puts the real status into the body
 * as `responseCode`. ApiResult exposes both, so tests assert on the meaningful one
 * and the HTTP status is still available for reporting.
 */
export interface ApiResult {
  httpStatus: number;
  responseCode: number;
  message?: string;
  body: unknown;
}

type FormData = Record<string, string>;

export class StoreApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string = env.apiUrl,
  ) {}

  // ---------- Products & brands ----------

  getProducts(): Promise<ApiResult> {
    return this.send('GET', '/productsList');
  }

  getBrands(): Promise<ApiResult> {
    return this.send('GET', '/brandsList');
  }

  searchProducts(term?: string): Promise<ApiResult> {
    return this.send('POST', '/searchProduct', term === undefined ? {} : { search_product: term });
  }

  // ---------- Accounts ----------

  createAccount(user: User): Promise<ApiResult> {
    return this.send('POST', '/createAccount', StoreApi.toAccountForm(user));
  }

  updateAccount(user: User): Promise<ApiResult> {
    return this.send('PUT', '/updateAccount', StoreApi.toAccountForm(user));
  }

  deleteAccount(email: string, password: string): Promise<ApiResult> {
    return this.send('DELETE', '/deleteAccount', { email, password });
  }

  verifyLogin(credentials: Partial<Record<'email' | 'password', string>>): Promise<ApiResult> {
    return this.send('POST', '/verifyLogin', credentials as FormData);
  }

  getUserByEmail(email: string): Promise<ApiResult> {
    return this.send('GET', `/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  }

  /** Low-level entry point, also used by tests that check unsupported HTTP methods. */
  async send(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, form?: FormData): Promise<ApiResult> {
    const response = await this.request.fetch(`${this.baseUrl}${path}`, {
      method,
      ...(form ? { form } : {}),
    });
    return StoreApi.parse(response);
  }

  private static async parse(response: APIResponse): Promise<ApiResult> {
    const text = await response.text();
    let body: { responseCode?: unknown; message?: unknown };
    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(
        `Expected JSON from ${response.url()} (HTTP ${response.status()}), got: ${text.slice(0, 200)}`,
      );
    }
    return {
      httpStatus: response.status(),
      responseCode: Number(body.responseCode),
      message: typeof body.message === 'string' ? body.message : undefined,
      body,
    };
  }

  private static toAccountForm(user: User): FormData {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.birthDay,
      birth_month: user.birthMonth,
      birth_year: user.birthYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber,
    };
  }
}
