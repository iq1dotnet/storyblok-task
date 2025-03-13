import { Locator, Page } from '@playwright/test';

export class Helpers {
  readonly acceptCookiesButton: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators using the locator method
    this.acceptCookiesButton = page.locator('button', { hasText: 'Accept All' });
  }

  async generateRandomEmail(): Promise<string> {
    const randomString = Math.random().toString(36).substring(7);
    return `testuser+${randomString}@automationstoryblok.com`;
  }

  async generateRandomNumber(): Promise<string> {
    return Math.random().toString(36).substring(2, 10); // Example random string generator
  }

  //this is not mine implementation, need to change it, but it works ok
  async generateRandomPassword(): Promise<string> {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "@.!";
    const allChars = upper + lower + digits + special;
    let password = 
        upper[Math.floor(Math.random() * upper.length)] +
        lower[Math.floor(Math.random() * lower.length)] +
        digits[Math.floor(Math.random() * digits.length)] +
        special[Math.floor(Math.random() * special.length)];

    // Fill the rest of the password with random characters
    password += Array.from({ length: 4 }, () => allChars[Math.floor(Math.random() * allChars.length)]).join('');
    return password;
}

  async generateRandomString(length: number = 10): Promise<string> {
    if (!length || length <= 0) {
      throw new Error('Invalid length provided for the random string.');
    }

    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
}
