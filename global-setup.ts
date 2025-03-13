import { chromium, FullConfig } from '@playwright/test';
import { RegistrationPage } from '../interview/pages/registration/registration.flow.page';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const authFile = path.join(__dirname, '.auth/user.json');

async function globalSetup(config: any) {
  let appUrl = process.env.LOGIN_URL;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const registration = new RegistrationPage(page);

  // Open Registration Page
  await page.goto(`${appUrl}`);

  await registration.openRegistrationPage();
  await registration.registerANewUser({
    firstName: "Mar",
    lastName: "Dim",
    companyName: "MartinCorp",
    termsAndConditions: true
  });
  // Store authentication state
  await page.context().storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;




