import { Browser, Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { Helpers } from '../../lib/helpers.ts';
import path from 'path';

export class SpacesCreationPage extends BasePage {
    readonly page: Page;
    private helpers: Helpers;
    private spaceName: string;
    readonly addSpaceButton: Locator;
    readonly spaceNameText: Locator;
    readonly continueButton: Locator;
    readonly createSpaceButton: Locator;
    readonly uploadFilesButton: Locator;
    readonly advancedOptionsButton: Locator;
    readonly assetTagsSearchInput: Locator;
    readonly assetTagsList: Locator;
    readonly saveButton: Locator;
    readonly fileInput: Locator;
    readonly sideMenuAssetsButton: Locator;
    readonly assetNameLabel: Locator;
    readonly assetTagsSelectionDropdown: Locator;
    readonly saveAdvancedOptionsButton: Locator;
    readonly uploadAssetsBotton: Locator;

    constructor(page: Page) {
        super(page, process.env.LOGIN_URL);
        this.page = page;
        this.helpers = new Helpers(page);
        this.spaceName = '';
        this.addSpaceButton = this.page.getByTestId('create-new-space-button');
        this.spaceNameText = this.page.getByRole('textbox', { name: 'Space name *' });
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.createSpaceButton = this.page.getByRole('button', { name: 'Create a Space' });
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
    }

    async initializeUserData(): Promise<void> {
        this.spaceName = await this.helpers.generateRandomString();
    }

    async createNewSpace(): Promise<void> {
        if (!this.spaceName) {
            await this.initializeUserData();
        }
        await this.addSpaceButton.click();
        await expect(this.page.getByTestId('plan-card-0')).toBeVisible();
        await this.continueButton.click();
        await this.spaceNameText.fill(this.spaceName); //add random space name
        //wont implement this now
        // await page.getByTestId('sb-select-inner-search-input').click()
        // await page.getByTestId('sb-select-list-item__0').click();
        await this.createSpaceButton.click();
        await expect(this.page.getByRole('heading', { name: this.spaceName })).toBeVisible(); //add random space name
    }
}
