import { Browser, Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
//import { MailosaurUtility } from '../../lib/mailosaur';
import { Helpers } from '../../lib/helpers.ts';
import path from 'path';
const authFile = path.join(__dirname, '../../.auth/user.json');

export class RegistrationPage extends BasePage {
    readonly loginEmail: Locator;
    readonly loginPassword: Locator;
    readonly signInButton: Locator;
    readonly signUpButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly companyNameInput: Locator;
    readonly passwordInput: Locator;
    readonly termsAndConditionsCheckbox: Locator;
    readonly finishRegistrationButton: Locator;
    readonly isOnboardingStepVisible: Locator;
    readonly firstNameOnboarding: Locator;
    readonly lastNameOnboarding: Locator;
    readonly companyNameOnboarding: Locator;
    readonly companySizeInputOnboarding: Locator;
    readonly companySizeOptionOnboarding: Locator;
    readonly developerButtonOnboarding: Locator;
    readonly phoneNumberOnboarding: Locator;
    readonly submitButtonOnboarding: Locator;
    readonly demoModalDialog: Locator;
    readonly closeDemoModal: Locator;
    readonly page: Page;
    private randomEmail: string;
    private randomPassword: string;
    //private mailosaur: MailosaurUtility;
    private helpers: Helpers;

    constructor(page: Page) {
        super(page, process.env.LOGIN_URL);
        this.page = page;
        this.helpers = new Helpers(page);
        // Mailosaur instance
        //this.mailosaur = new MailosaurUtility(process.env.MAILOSAUR_API_KEY!, process.env.MAILOSAUR_SERVER_ID!);
        // Initialize the random email and user to be used accross the methods
        this.randomEmail = '';
        this.randomPassword = '';
        this.loginEmail = this.page.getByTestId('login-email');
        this.loginPassword = this.page.getByTestId('login-password');
        this.signInButton = this.page.getByTestId('submit');
        this.signUpButton = this.page.getByRole('link', { name: 'Sign up' });
        this.firstNameInput = this.page.getByRole('textbox', { name: 'First name' });
        this.lastNameInput = this.page.getByRole('textbox', { name: 'Last name' });
        this.companyNameInput = this.page.getByRole('textbox', { name: 'Company Name' });
        this.emailInput = this.page.getByTestId('signup-email');
        this.passwordInput = this.page.getByTestId('signup-password');
        this.termsAndConditionsCheckbox = this.page.getByText('I agree to the Terms of');
        this.finishRegistrationButton = this.page.getByTestId('submit');
        this.isOnboardingStepVisible = page.locator('p.step-subtitle', { hasText: 'Step 1 of 2' });
        this.firstNameOnboarding = this.page.getByTestId('onboarding-first-name');
        this.lastNameOnboarding = this.page.getByTestId('onboarding-last-name');
        this.companyNameOnboarding = this.page.getByTestId('onboarding-company-name');
        this.companySizeInputOnboarding = this.page.getByTestId('onboarding-company-size-inner-search-input');
        this.companySizeOptionOnboarding = this.page.getByTestId('onboarding-company-size-list-item__0-label');
        this.developerButtonOnboarding = this.page.getByTestId('option-marketer');
        this.phoneNumberOnboarding = this.page.getByTestId('phone-input');
        this.submitButtonOnboarding = this.page.getByTestId('onboarding-submit-btn');
        this.closeDemoModal = this.page.getByTestId('nudge-step-close-button');
        this.demoModalDialog = this.page.locator('.rc-dialog-root');
    }

    async initializeUserData(): Promise<void> {
        this.randomEmail = await this.helpers.generateRandomEmail();
        this.randomPassword = await this.helpers.generateRandomPassword();
    }

    async goTo(): Promise<void> {
        await this.page.goto(this.url!);
    }

    async openRegistrationPage(): Promise<void> {
        await this.signUpButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async timeout(pauseInMs: number) {
        await this.page.waitForTimeout(pauseInMs);
    }
    //in case you are wondering why i handle 2 scenarios, by god, i was not able to understand the redirect logic
    //I wanted to spend more time and intercept the requests, but im too sick to do that now. 
    //ill check it during the weekend, as its interesting thing, that might have security exploit, so if i find something,
    //regardless of the process, ill let you know.
    async registerANewUser({
        firstName,
        lastName,
        email,
        password,
        companyName,
        termsAndConditions,
        phoneNumber = '1234567890', // Default value for phone number
    }: {
        firstName: string;
        lastName: string;
        email?: string;
        password?: string;
        companyName: string;
        termsAndConditions: boolean;
        phoneNumber?: string;
    }): Promise<void> {
        if (!this.randomEmail || !this.randomPassword) {
            await this.initializeUserData();
        }
        // If first name is visible, we are likely in the first sign-up flow
        if (firstName && await this.firstNameInput.isVisible()) {
            console.log('---Onboarding flow SKIPPED!---');

            // Fill in user data
            await this.firstNameInput.fill(firstName);
            await this.lastNameInput.fill(lastName);
            await this.emailInput.fill(this.randomEmail);
            //There are 2 bugs on the sign up page: (my subjective opinion, but maybe its a feature, dont knwo :) 
            //1.When click on the Eye to show password, the password is not shown, but the password requirements are displayed.
            //2.When enter password, the requirements ddl stays open, which prenvets manipulation of elements until click or any other event happens
            //adding TAB to make the test pass, but essentially, i would remove the focus event when all requirements for password are fulfiled.
            //that way we have validation (focus event until requrements fullfiled) and also can have automation test and not blocking components. 
            await this.passwordInput.fill(this.randomPassword);
            await this.page.keyboard.press('Tab');
            await this.companyNameInput.fill(companyName);

            // Handle terms and conditions
            if (termsAndConditions) {
                await this.termsAndConditionsCheckbox.check();
            }

            // Wait for network idle and submit the form
            await this.page.waitForLoadState('networkidle');
            await this.finishRegistrationButton.click();

            // Wait for redirection and verify URL
            this.timeout(2000);
            await expect(this.page).toHaveURL(/.*\/signup/);
        }
        else {
            console.log('---Onboarding flow started!---');

            // If we are in the onboarding flow
            await this.emailInput.fill(this.randomEmail);
            await this.passwordInput.fill(this.randomPassword);
            await this.page.keyboard.press('Tab');

            // Handle terms and conditions
            if (termsAndConditions) {
                await this.termsAndConditionsCheckbox.check();
            }

            // Submit the registration form
            await this.finishRegistrationButton.click();

            // Verify we're in the onboarding flow
            await expect(this.page).toHaveURL(/.*\/onboarding/);
            await expect(this.isOnboardingStepVisible).toBeVisible();

            // Fill the onboarding form with provided data or default values
            await this.firstNameOnboarding.fill(firstName);
            await this.lastNameOnboarding.fill(lastName);
            await this.companyNameOnboarding.fill(companyName);

            // Handle the company size dropdown menu, select the first option
            await this.companySizeInputOnboarding.click();
            await this.companySizeOptionOnboarding.click();

            // Click on the developer button
            await this.developerButtonOnboarding.click();

            // Fill the phone number if it's provided or use default
            await this.phoneNumberOnboarding.fill(phoneNumber);

            // Wait for network idle and submit
            await this.page.waitForLoadState('networkidle');
            await this.submitButtonOnboarding.click();

            // Close demo modal and verify it's closed
            await this.closeDemoModal.click();
            await expect(this.demoModalDialog).not.toBeVisible();

            //await this.page.context().storageState({ path: authFile });
            console.log('---Onboarding flow finished!---');
        }
    }
}
