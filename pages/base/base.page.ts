import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;
  readonly url: string;

  constructor(page: Page, url?: string) {
    this.page = page;
    if (url) {
      this.url = url;
    }
  }

  async goTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async timeout(time): Promise<void>{
    await this.page.waitForTimeout(time);
  }
}
