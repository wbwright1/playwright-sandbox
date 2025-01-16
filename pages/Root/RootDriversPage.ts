import { Page, Locator } from "@playwright/test";
import { DriverInfo } from "../../tests/utils/driverInfoUtils";
import { selectDropdownOptions } from "../../tests/utils/selectDropdownOptions"; // Adjust path if needed

type Driver = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  driverLicense: string;
  dLState: string;
  education: string;
};

export class RootDriversPage {
  private heading: Locator;
  private deleteDriverButton: Locator;
  private deleteOtherDriverButton: Locator;
  private driverLicenseField: Locator;
  private dLStateDropdown: Locator;
  private educationDropdown: Locator;
  private occupationField: Locator;
  private addDriverButton: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Driver Review" });
    this.addDriverButton = page.getByTestId('content-container-component').getByTestId('add-button')
    this.deleteDriverButton = page.getByLabel("delete driver").first();
    this.deleteOtherDriverButton = page.getByLabel("delete driver").nth(1);
    this.driverLicenseField = page.locator(
      'input[name="items.0.driverLicense"]'
    );
    this.dLStateDropdown = page.locator('button[name="items.0.dLState"]');
    this.educationDropdown = page.locator('button[name="items.0.education"]');
    this.occupationField = page
      .locator(".type-ahead-select__input-container")
      .first();
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async setDriverExclusionValues(
    discoveredDriverStatus: string
  ): Promise<void> {
    const fieldsLocator = '[id^="input-driverExclusionSelect-"]';

    // Create an array of values to be selected
    const values = Array(await this.page.locator(fieldsLocator).count()).fill({
      value: discoveredDriverStatus,
    });

    await selectDropdownOptions(this.page, fieldsLocator, values);
  }

  async addDriver(driverOrDrivers: Driver | Driver[]) {
    const drivers = Array.isArray(driverOrDrivers) ? driverOrDrivers : [driverOrDrivers];

    for (const driver of drivers) {
      const index = await drivers.length;

      if (index > 1) {
        await this.addDriverButton.click();
        await this.page.waitForTimeout(500); // Optional: Wait for UI update
      }

      await this.fillAdditionalDriverInfo(driver, index);
    }
  }

  async deleteAllDrivers() {
    while (
      (await this.deleteDriverButton.isVisible()) ||
      (await this.deleteOtherDriverButton.isVisible())
    ) {
      if (await this.deleteDriverButton.isVisible()) {
        await this.deleteDriverButton.click();
      }
      if (await this.deleteOtherDriverButton.isVisible()) {
        await this.deleteOtherDriverButton.click();
      }
    }
  }

  async deleteAllOtherDrivers() {
    while (await this.deleteOtherDriverButton.isVisible()) {
      await this.deleteOtherDriverButton.click();
    }
  }

  async fillPrimaryDriverInfo(
    license: string,
    state: string,
    education: string
  ) {
    await this.driverLicenseField.fill(license);

    // Click dropdown and select value for state
    await this.dLStateDropdown.click();
    await this.page.click(`text="${state}"`);

    // Click dropdown and select value for education
    await this.dLStateDropdown.click();
    await this.page.click(`text="${education}"`);
  }

  private async fillAdditionalDriverInfo(driver: Driver, index: number) {
    const adjustedIndex = index - 2; // Adjust index to match the locators starting from 1
    if (index === 1) {
      console.log('Skipping driver 1');
      return;
    }
    
    await this.page.fill(`input[id="input-firstNameInput-${adjustedIndex}"]`, driver.firstName);
    await this.page.fill(`input[id="input-lastNameInput-${adjustedIndex}"]`, driver.lastName);
    await this.page.type(`input[id="input-dobInput-${adjustedIndex}"]`, driver.dob);
  
    // Gender dropdown
    await this.page.locator(`button[id="input-genderInput-${adjustedIndex}"]`).click();
    await this.page.click(`text="${driver.gender}"`);
  
    // Marital status dropdown
    await this.page.locator(`button[id="input-maritalStatusInput-${adjustedIndex}"]`).click();
    await this.page.click(`text="${driver.maritalStatus}"`);
  
    await this.page.fill(`input[id="input-driversLicenseInput-${adjustedIndex}"]`, driver.driverLicense);
  
    // State dropdown
    await this.page.locator(`button[id="input-driversLicenseState-${adjustedIndex}"]`).click();
    await this.page.click(`text="${driver.dLState}"`);
  
    // Education dropdown
    await this.page.locator(`button[id="input-education-${adjustedIndex}"]`).click();
    await this.page.click(`text="${driver.education}"`);
  }

  async selectPrimaryOccupation() {
    await this.occupationField.click();
    await this.page.keyboard.press("Enter");
  }

  async selectOccupation(index: number) {
    const driverOccupation = await this.page
      .locator(".type-ahead-select__input-container")
      .nth(index);
    await driverOccupation.click();
    await this.page.keyboard.press("Enter");
  }

  async getDriverCount(): Promise<number> {
    return await this.page.locator(".driver-info-section").count();
  }

  async addMultipleDrivers(drivers: DriverInfo[]) {
    for (const driver of drivers) {
      await this.addDriver(driver);
    }
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
