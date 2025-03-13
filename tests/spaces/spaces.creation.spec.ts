import { test, Page } from '@playwright/test';
import { SpacesCreationPage } from '../../pages/spaces/spaces.creation.page';
import { AssetsCreationPage } from '../../pages/spaces/assets.page';
import * as dotenv from 'dotenv';

dotenv.config();

let spacesPage: SpacesCreationPage;
let assetPage: AssetsCreationPage;

test.describe('Spaces: ', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    spacesPage = new SpacesCreationPage(page);
    assetPage = new AssetsCreationPage(page);
    await spacesPage.goTo();
  });

  //both scenarios are in one test, as in order to make this separated, I need to create complete data layer, that will generate spaces via the API, and add assets as welll
  //on which we can run the verifications.
  //ideal implementation will be a separated data layer, that will give us the benefit of dynamic data creation without complication in the logic of the tests
  test('Add new space and upload assets', async (page) => {
    await spacesPage.createNewSpace();
    await assetPage.openAssetsMenu();
    await assetPage.uploadFile('../../goose.jpg', 'Upload files');
    await assetPage.hoverAndOpenAdvancedOptions(0);
    await assetPage.addTag('story#1');
    await assetPage.saveAdvancedOptionModal();
    await assetPage.uploadFile('../../goose.jpg', 'Add more');
    await assetPage.hoverAndOpenAdvancedOptions(1);
    await assetPage.selectExistingTag('story#1');
    await assetPage.saveAdvancedOptionModal();
    await assetPage.uploadFile('../../goose.jpg', 'Add more');
    await assetPage.hoverAndOpenAdvancedOptions(2);
    await assetPage.addTag('story#2');
    await assetPage.saveAdvancedOptionModal();
    await assetPage.uploadAndVerifyAssets();
    await assetPage.filterAssets('By Tag (options)', 'story#1');
    await assetPage.deleteAssets();
    await assetPage.verifyAssetsAreDeletred();
    await assetPage.verifyDeletreAssetsIsNotEmpty();
  })

});

