import { Browser, Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { MailosaurUtility } from '../../lib/mailosaur';
import { Helpers } from '../../lib/helpers.ts';
import path from 'path';

export class SpacesCreationPage extends BasePage {
    readonly page: Page;
    private mailosaur: MailosaurUtility;
    private helpers: Helpers;
    readonly createSpaceBotton: Locator;

    constructor(page: Page) {
        super(page, process.env.LOGIN_URL);
        this.page = page;
        this.helpers = new Helpers(page);
        this.createSpaceBotton = this.page.getByTestId('create-new-space-button');
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
    }

}
