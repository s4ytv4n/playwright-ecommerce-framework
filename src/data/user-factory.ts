import { faker } from '@faker-js/faker';
import type { User } from '@models/user';

/** Countries available in the store's signup dropdown. */
const SUPPORTED_COUNTRIES = [
  'India',
  'United States',
  'Canada',
  'Australia',
  'Israel',
  'New Zealand',
  'Singapore',
] as const;

export class UserFactory {
  /**
   * Builds a unique, valid user. Pass overrides for the fields a test cares about,
   * e.g. UserFactory.create({ country: 'Canada' }).
   */
  static create(overrides: Partial<User> = {}): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 70 });

    return {
      title: faker.helpers.arrayElement(['Mr', 'Mrs'] as const),
      name: `${firstName} ${lastName}`,
      // Timestamp + random suffix keeps emails unique across parallel workers and CI reruns.
      email: `qa.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@example.com`,
      password: faker.internet.password({ length: 12, prefix: 'Qa1!' }),
      birthDay: String(birthDate.getDate()),
      birthMonth: String(birthDate.getMonth() + 1),
      birthYear: String(birthDate.getFullYear()),
      firstName,
      lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.arrayElement(SUPPORTED_COUNTRIES),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode('#####'),
      mobileNumber: faker.string.numeric(10),
      ...overrides,
    };
  }
}
