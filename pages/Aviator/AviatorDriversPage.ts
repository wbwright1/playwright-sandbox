import { Page, Locator } from '@playwright/test';
import { DriverInfo } from '../../tests/utils/driverInfoUtils';

export class AviatorDriversPage {
    private deleteDriverButton: Locator;
    private driverLicenseField: Locator;
    private dLStateDropdown: Locator;
    private educationDropdown: Locator;
    private occupationField: Locator;
    private continueButton: Locator;
    private addDriverButton: Locator;

    constructor(private page: Page) {
        this.addDriverButton = page.getByRole('button', { name: 'add driver' });
        this.deleteDriverButton = page.getByRole('button', { name: 'delete driver' });
        this.driverLicenseField = page.locator('input[name="items.0.driverLicense"]');
        this.dLStateDropdown = page.locator('select[name="items.0.dLState"]');
        this.educationDropdown = page.locator('select[name="items.0.education"]');
        this.occupationField = page.locator('.type-ahead-select__input-container').first();
        this.continueButton = page.getByRole('button', { name: 'Continue'});
    }

    async addDriver(driverInfo: DriverInfo) {
        const index = await this.getDriverCount();
        if (index > 0) {
            await this.addDriverButton.click();
            await this.page.waitForTimeout(500); // Wait for the new driver form to appear
        }
        await this.fillAdditionalDriverInfo(driverInfo, index);
    }
      

    async deleteAllDrivers() {
        while (await this.deleteDriverButton.isVisible()) {
            await this.deleteDriverButton.click();
        }
    }

     async fillPrimaryDriverInfo(license: string, state: string, education: string) {
         await this.driverLicenseField.fill(license);
         await this.dLStateDropdown.selectOption({ value: state });
         await this.educationDropdown.selectOption({ value: education });
     }

    async fillAdditionalDriverInfo(driverInfo: DriverInfo, index: number) {
        await this.page.fill(`input[name="items.${index}.firstName"]`, driverInfo.firstName);
        await this.page.fill(`input[name="items.${index}.lastName"]`, driverInfo.lastName);
        await this.page.fill(`input[name="items.${index}.dateOfBirth"]`, driverInfo.dob);
        await this.page.selectOption(`select[name="items.${index}.gender"]`, driverInfo.gender);
        if (driverInfo.suffix) {
            await this.page.selectOption(`select[name="items.${index}.suffix"]`, driverInfo.suffix);
        }
        await this.page.fill(`input[name="items.${index}.driverLicense"]`, driverInfo.license);
        await this.page.selectOption(`select[name="items.${index}.dLState"]`, { value: driverInfo.state });
        await this.page.selectOption(`select[name="items.${index}.education"]`, { value: driverInfo.education });
      }

     async selectPrimaryOccupation() {
         await this.occupationField.click();
         await this.page.keyboard.press('Enter');
     }

    async selectOccupation(index: number) {
        const driverOccupation = await this.page.locator('.type-ahead-select__input-container').nth(index);
        await driverOccupation.click();
        await this.page.keyboard.press('Enter');
    }

    async getDriverCount(): Promise<number> {
        return await this.page.locator('.driver-info-section').count();
    }

    async addMultipleDrivers(drivers: DriverInfo[]) {
        for (const driver of drivers) {
            await this.addDriver(driver);
        }
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
