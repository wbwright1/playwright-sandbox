import { Page, Locator } from "@playwright/test";
import { DriverInfo } from "../../tests/utils/driverInfoUtils";
import { selectDropdownOptions } from "../../tests/utils/selectDropdownOptions"; // Adjust path if needed

type Driver = {
  firstName: string;
  lastName: string;
  dob: string;
  driverStatus?: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  driverLicense: string;
  dLState: string;
  yearsLicensed?: string;
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

  async addDrivers(driverOrDrivers: Driver | Driver[]) {
    const drivers = Array.isArray(driverOrDrivers) ? driverOrDrivers : [driverOrDrivers];

    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i];
  
      if (i > 0) {
        // Add a new driver button click only for subsequent drivers
        await this.addDriverButton.click();
        await this.page.waitForTimeout(500); // Optional: Wait for UI update
        await this.fillAdditionalDriverInfo(driver, i);
      }
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
    
    await this.page.fill(`input[id="input-firstNameInput-${index}"]`, driver.firstName);
    await this.page.fill(`input[id="input-lastNameInput-${index}"]`, driver.lastName);
    await this.page.type(`input[id="input-dobInput-${index}"]`, driver.dob);
  
    // Coverage Status dropdown
    await this.page.locator(`button[id="input-driverStatusInput-${index}"]`).click();
    await this.page.getByLabel(`${driver.driverStatus}`).click();

    // Gender dropdown
    await this.page.locator(`button[id="input-genderInput-${index}"]`).click();
    await this.page.click(`text="${driver.gender}"`);
  
    // Marital status dropdown
    await this.page.locator(`button[id="input-maritalStatusInput-${index}"]`).click();
    await this.page.getByLabel(`${driver.maritalStatus}`).click();
  
    // Drivers License input
    await this.page.fill(`input[id="input-licenseNumberInput-${index}"]`, driver.driverLicense);
  
    // Drivers License State dropdown
    await this.page.locator(`button[id="input-licenseStateInput-${index}"]`).click();
    await this.page.getByLabel(`${driver.dLState}`).click();
  
    // Years Licensed dropdown
    await this.page.locator(`button[id="input-yearsLicensed-${index}"]`).click();
    await this.page.getByLabel(`${driver.yearsLicensed}`).click();

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

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
