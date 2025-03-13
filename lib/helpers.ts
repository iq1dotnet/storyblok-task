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

  // Returns the current timestamp in mm-dd-yy-T-HH-MM format (e.g., "02-07-23-T-12-34").
  async generateRandomTimestamp(): Promise<string> {
    const now = new Date();
    const formattedTimestamp =
      `${(now.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${now.getDate().toString().padStart(2, '0')}-` +
      `${now.getFullYear().toString().slice(-2)}-T-` +
      `${now.getHours().toString().padStart(2, '0')}-` +
      `${now.getMinutes().toString().padStart(2, '0')}`;
    return formattedTimestamp;
  }
}
