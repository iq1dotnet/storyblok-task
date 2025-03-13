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

  test('Add new space', async (page) => {
   spacesPage.createSpaceBotton.click();
  })
});

