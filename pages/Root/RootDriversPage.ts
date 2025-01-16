import { Page, Locator } from "@playwright/test";
import { DriverInfo } from "../../tests/utils/driverInfoUtils";
import { selectDropdownOptions } from "../../tests/utils/selectDropdownOptions"; // Adjust path if needed

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
    this.addDriverButton = page.getByRole("button", { name: "add driver" });
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

  async addDriver(driverInfo: DriverInfo) {
    const index = await this.getDriverCount();
    if (index > 0) {
      await this.addDriverButton.click();
      await this.page.waitForTimeout(500);
    }
    await this.fillAdditionalDriverInfo(driverInfo, index);
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

  async fillAdditionalDriverInfo(driverInfo: DriverInfo, index: number) {
    await this.page.fill(
      `input[name="items.${index}.firstName"]`,
      driverInfo.firstName
    );
    await this.page.fill(
      `input[name="items.${index}.lastName"]`,
      driverInfo.lastName
    );
    await this.page.fill(
      `input[name="items.${index}.dateOfBirth"]`,
      driverInfo.dob
    );

    // Gender dropdown
    await this.page.locator(`button[name="items.${index}.gender"]`).click();
    await this.page.click(`text="${driverInfo.gender}"`);

    if (driverInfo.suffix) {
      await this.page.locator(`button[name="items.${index}.suffix"]`).click();
      await this.page.click(`text="${driverInfo.suffix}"`);
    }

    await this.page.fill(
      `input[name="items.${index}.driverLicense"]`,
      driverInfo.license
    );

    // State dropdown
    await this.page.locator(`button[name="items.${index}.dLState"]`).click();
    await this.page.click(`text="${driverInfo.state}"`);

    // Education dropdown
    await this.page.locator(`button[name="items.${index}.education"]`).click();
    await this.page.click(`text="${driverInfo.education}"`);
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
