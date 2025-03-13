import { test, Page } from '@playwright/test';
import { SpacesCreationPage } from '../../pages/spaces/spaces.creation.page';
import * as dotenv from 'dotenv';

dotenv.config();

let spacesPage: SpacesCreationPage;

test.describe('Spaces: ', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    spacesPage = new SpacesCreationPage(page);
    await spacesPage.goTo();

  });

  test('Add new space and upload assets', async (page) => {
    await spacesPage.createNewSpace();
    await spacesPage.openAssetsMenu();
    await spacesPage.uploadFile('../../goose.jpg', 'Upload files');
    await spacesPage.hoverAndOpenAdvancedOptions(0);
    await spacesPage.addTag('story#1');
    await spacesPage.saveAdvancedOptionModal();
    await spacesPage.uploadFile('../../goose.jpg', 'Add more');
    await spacesPage.hoverAndOpenAdvancedOptions(1);
    await spacesPage.selectExistingTag('story#1');
    await spacesPage.saveAdvancedOptionModal();
    await spacesPage.uploadFile('../../goose.jpg', 'Add more');
    await spacesPage.hoverAndOpenAdvancedOptions(2);
    await spacesPage.addTag('story#2');
    await spacesPage.saveAdvancedOptionModal();
    await spacesPage.uploadAndVerifyAssets();
  })
});

