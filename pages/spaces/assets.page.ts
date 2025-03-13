import { Browser, Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { Helpers } from '../../lib/helpers.ts';
import path from 'path';

export class AssetsCreationPage extends BasePage {
    readonly page: Page;
    private helpers: Helpers;
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
    readonly sideMenuDeletedAssetsButton: Locator;
    readonly assetNameLabel: Locator;
    readonly assetTagsSelectionDropdown: Locator;
    readonly saveAdvancedOptionsButton: Locator;
    readonly uploadAssetsBotton: Locator;
    readonly filterAssetsButton: Locator;
    readonly applyFiltersButton: Locator;
    readonly filteryBy: Locator;

    constructor(page: Page) {
        super(page, process.env.LOGIN_URL);
        this.page = page;
        this.helpers = new Helpers(page);

        this.sideMenuAssetsButton = this.page.getByTestId('app-sidebar-route__ListAssetsRoute');
        this.advancedOptionsButton = this.page.getByRole('button', { name: 'Advanced options' });
        this.assetNameLabel = this.page.getByLabel('Name');
        this.assetTagsSelectionDropdown = this.page.getByTestId('asset-tags-inner-search-input')
        this.saveAdvancedOptionsButton = this.page.getByRole('button', { name: 'Save' });
        this.uploadAssetsBotton = this.page.getByRole('button', { name: 'Upload', exact: true })
        //delete
        this.sideMenuDeletedAssetsButton = this.page.getByRole('button', { name: 'Deleted assets' });
        this.filterAssetsButton = this.page.getByRole('button', { name: 'Filter' });
        this.applyFiltersButton = this.page.getByTestId('base-grouped-menu-confirm-button');
        this.filteryBy = this.page.getByTestId('asset-filter-tags-inner-search-input');
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
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
        await this.page.waitForTimeout(200);
        await this.assetTagsSelectionDropdown.fill(tag);
        await this.assetTagsSelectionDropdown.press('Enter');
        await this.page.waitForTimeout(200);
    }

    async selectExistingTag(tag: string): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.assetTagsSelectionDropdown.fill(tag);
        await this.page.getByTestId('asset-tags-list-item__0').locator('div').filter({ hasText: tag }).click();
        await this.page.waitForTimeout(200);
    }

    async saveAdvancedOptionModal(): Promise<void> {
        await this.saveAdvancedOptionsButton.click();
    }

    async uploadAndVerifyAssets(): Promise<void> {
        await this.uploadAssetsBotton.click();
        await expect(this.page.locator('.assets-list')).not.toBeEmpty();
    }

    async filterAssets(selectOption: string, tagName: string) {
        await this.filterAssetsButton.click();
        await this.page.getByText(selectOption).click();
        await this.applyFiltersButton.click();
        // Dropdown for tag search
        await this.filteryBy.click();
        await this.page.getByTestId('asset-filter-tags-list-item__0').locator('div').filter({ hasText: tagName }).click();
        await this.page.keyboard.press('Escape');
    }
    
    async deleteAssets(){
        await this.page.locator('.assets-list-item.assets-list__item').first().hover();
        await this.page.locator('.assets-list-item-preview > .sb-checkbox > .sb-checkbox__inner > .sb-checkbox__input > .sb-checkbox__svg').first().click();
        await this.page.getByRole('button', { name: 'Select All' }).click();
        await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
        await expect(this.page.getByRole('heading', { name: 'Delete Assets' })).toBeVisible();
        await this.page.locator('.sb-modal.assets-delete-modal button', { hasText: 'Delete' }).click();
    }

    async verifyAssetsAreDeletred(){
        //verify empty list
        await expect(this.page.locator('.assets-list')).toHaveCount(0);
    }

    async verifyDeletreAssetsIsNotEmpty(): Promise<void> {
        //since this is a isolated scenario, we dont expect any other assets in deleted apart of the one deleted, so not being empty is validatio enough for now
        await this.sideMenuDeletedAssetsButton.click();
        await expect(this.page.locator('.assets-list.assets-list--table.assets-list--deleted')).not.toBeEmpty();
    }
}
