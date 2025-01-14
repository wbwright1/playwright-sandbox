import { Page, Locator } from "@playwright/test";
import { DriverInfo } from "../../tests/utils/driverInfoUtils";
import { retry } from "../../tests/utils/retryUtils";

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
    this.dLStateDropdown = page.locator('select[name="items.0.dLState"]');
    this.educationDropdown = page.locator('select[name="items.0.education"]');
    this.occupationField = page
      .locator(".type-ahead-select__input-container")
      .first();
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  async setDriverExclusionValues(
    discoveredVehicleStatus: string
  ): Promise<void> {
    const fields = this.page.locator('[id^="input-driverExclusionSelect-"]');

    // Get the total number of matching fields
    const totalFields = await fields.count();

    if (totalFields === 0) {
      console.log("No fields available to set.");
      return;
    }

    // Iterate through all fields and set the value
    for (let i = 0; i < totalFields; i++) {
      await fields.nth(i).selectOption(discoveredVehicleStatus);
    }
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
    await this.dLStateDropdown.selectOption({ value: state });
    await this.educationDropdown.selectOption({ value: education });
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
    await this.page.selectOption(
      `select[name="items.${index}.gender"]`,
      driverInfo.gender
    );
    if (driverInfo.suffix) {
      await this.page.selectOption(
        `select[name="items.${index}.suffix"]`,
        driverInfo.suffix
      );
    }
    await this.page.fill(
      `input[name="items.${index}.driverLicense"]`,
      driverInfo.license
    );
    await this.page.selectOption(`select[name="items.${index}.dLState"]`, {
      value: driverInfo.state,
    });
    await this.page.selectOption(`select[name="items.${index}.education"]`, {
      value: driverInfo.education,
    });
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

  //   async clickContinue() {
  //     await this.continueButton.click();
  //   }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
