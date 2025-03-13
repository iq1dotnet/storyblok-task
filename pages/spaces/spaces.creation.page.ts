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
    
    constructor(page: Page) {
        super(page, process.env.LOGIN_URL);
        this.page = page;
        this.helpers = new Helpers(page);
        this.spaceName = '';
        this.addSpaceButton = this.page.getByTestId('create-new-space-button');
        this.spaceNameText = this.page.getByRole('textbox', { name: 'Space name *' });
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.createSpaceButton =  this.page.getByRole('button', { name: 'Create a Space' });

        this.fileInput = page.locator('input[type="file"]');


        // this.uploadFilesButton = this.page.getByTestId('list-assets-upload-files-button');
        
        // this.advancedOptionsButton = this.page.locator('button', { name: 'Advanced options' });
        // this.assetTagsSearchInput = this.page.getByTestId('asset-tags-inner-search-input');
        // this.assetTagsList = this.page.getByTestId('asset-tags-list');
        // this.saveButton = this.page.getByRole('button', { name: 'Save' });



        // await page.getByTestId('app-sidebar-route__ListAssetsRoute').click();

        // await page.getByRole('button', { name: 'Upload files' }).click();
        // await page.getByRole('button', { name: 'Upload files' }).setInputFiles('goose.jpg');
        // await page.getByRole('button', { name: 'Advanced options' }).click();
        // await page.getByTestId('asset-tags-inner-search-input').click();
        // await page.getByTestId('asset-tags-inner-search-input').fill('story#1');
        // await page.getByTestId('asset-tags-list').getByText('Create').click();
        // await page.getByRole('button', { name: 'Save' }).click();


        // await page.getByRole('button', { name: 'Add more' }).click();
        // await page.getByRole('button', { name: 'Add more' }).setInputFiles('goose.jpg');
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
    }

    async initializeUserData(): Promise<void> {
        this.spaceName = await this.helpers.generateRandomString();
    }

    async createNewSpace(): Promise<void>{
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

        //navigate to assets
        //await this.page.getByTestId('app-sidebar-route__ListAssetsRoute').click();
       await this.openAssetsMenu();
        //upload a file
        // const fileChooserPromise = this.page.waitForEvent('filechooser');
        // await this.page.getByRole('button', { name: 'Upload files' }).click();
        // const fileChooser = await fileChooserPromise;
        // await fileChooser.setFiles(path.join(__dirname, '../../goose.jpg'));
        await this.uploadFile('../../goose.jpg', 'Upload files');

        //hover to see advanced options
        // await this.page.getByLabel('Name').hover();
        // await this.page.getByRole('button', { name: 'Advanced options' }).click();
        await this.hoverAndOpenAdvancedOptions(0);

        //tags
        await this.addTag('story#1');

        //save advanced options
        //await this.page.getByRole('button', { name: 'Save' }).click();
        await this.saveAdvancedOptionModal();

        //upload files
        await this.uploadFile('../../goose.jpg', 'Add more');

        //hover to see advanced options
        await this.hoverAndOpenAdvancedOptions(1);

        //expand tag dropdown
        await this.selectExistingTag('story#1');
        
        //save
        // await this.page.getByRole('button', { name: 'Save' }).click();
        await this.saveAdvancedOptionModal();

        //fixit donzo wont work
        await this.uploadAndVerifyAssets();
    }

    async openAssetsMenu(): Promise<void>{
        await this.page.getByTestId('app-sidebar-route__ListAssetsRoute').click();
        }

    async uploadFile(filePath: string, buttonName: string): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.getByRole('button', { name: buttonName }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, filePath));
      }

    async hoverAndOpenAdvancedOptions(index): Promise<void> {
        await this.page.getByLabel('Name').nth(index).hover();
        await this.page.getByRole('button', { name: 'Advanced options' }).click();
      }
    
      async addTag(tag: string): Promise<void> {
        await this.page.getByTestId('asset-tags-inner-search-input').click();
        await this.page.getByTestId('asset-tags-inner-search-input').fill(tag);
        await this.page.getByTestId('asset-tags-inner-search-input').press('Enter');
      }
    
      async selectExistingTag(tag: string): Promise<void> {
        await this.page.getByTestId('asset-tags-inner-search-input').fill(tag);
        await this.page.getByTestId('asset-tags-list-item__0').locator('div').filter({ hasText: tag }).click();
      }
    
      async saveAdvancedOptionModal(): Promise<void>{
        await this.page.getByRole('button', { name: 'Save' }).click();
      }
      
      async uploadAndVerifyAssets(): Promise<void> {
        await this.page.getByRole('button', { name: 'Upload', exact: true }).click();
        await expect(this.page.locator('.assets-list')).not.toBeEmpty();
      }
    //fix it once run correctly
}
