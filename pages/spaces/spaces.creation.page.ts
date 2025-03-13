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
        this.sideMenuAssetsButton = this.page.getByTestId('app-sidebar-route__ListAssetsRoute');
        this.advancedOptionsButton = this.page.getByRole('button', { name: 'Advanced options' });
        this.assetNameLabel = this.page.getByLabel('Name');
        this.assetTagsSelectionDropdown = this.page.getByTestId('asset-tags-inner-search-input')
        this.saveAdvancedOptionsButton = this.page.getByRole('button', { name: 'Save' });
        this.uploadAssetsBotton = this.page.getByRole('button', { name: 'Upload', exact: true })
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
    }

    async initializeUserData(): Promise<void> {
        this.spaceName = await this.helpers.generateRandomString();
    }

    async openAssetsMenu(): Promise<void> {
        await this.sideMenuAssetsButton.click();
    }

    async uploadFile(filePath: string, buttonName: string): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.getByRole('button', { name: buttonName }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, filePath));
    }

    async hoverAndOpenAdvancedOptions(index): Promise<void> {
        await this.assetNameLabel.nth(index).hover();
        await this.advancedOptionsButton.click();
    }

    async addTag(tag: string): Promise<void> {
        await this.assetTagsSelectionDropdown.fill(tag);
        await this.assetTagsSelectionDropdown.press('Enter');
    }

    async selectExistingTag(tag: string): Promise<void> {
        await this.assetTagsSelectionDropdown.fill(tag);
        await this.page.getByTestId('asset-tags-list-item__0').locator('div').filter({ hasText: tag }).click();
    }

    async saveAdvancedOptionModal(): Promise<void> {
        await this.saveAdvancedOptionsButton.click();
    }

    async uploadAndVerifyAssets(): Promise<void> {
        await this.uploadAssetsBotton.click();
        await expect(this.page.locator('.assets-list')).not.toBeEmpty();
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
