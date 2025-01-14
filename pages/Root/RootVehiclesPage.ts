import { Page, Locator } from "@playwright/test";

export class RootVehiclesPage {
  private heading: Locator;
  private deleteVehicleButton: Locator;
  private deleteOtherVehicleButton: Locator;
  private vinField: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Vehicle Review",
    });
    this.deleteVehicleButton = page.getByLabel("delete vehicle").nth(1);
    this.deleteOtherVehicleButton = page.getByLabel("delete vehicle").nth(2);
    this.vinField = page.locator('input[name="items.0.Vin"]');
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  async setVehicleExclusionValues(
    discoveredVehicleStatus: string
  ): Promise<void> {
    const fields = this.page.locator('[id^="input-vehicleExclusionSelect-"]');

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

  async assignDriversToVehicles(
    vehicles: { assignedDriver: string }[]
  ): Promise<void> {
    for (const [index, vehicle] of vehicles.entries()) {
      const driverFieldLocator = this.page.locator(
        `#input-driverVehicleAssignmentInput-${index}`
      );

      // Check if the field exists on the page
      if ((await driverFieldLocator.count()) > 0) {
        console.log(
          `Setting driver for Vehicle ${index + 1} to: ${
            vehicle.assignedDriver
          }`
        );

        // Click the driver field to open the dropdown
        await driverFieldLocator.click();

        // Use getByText to select the assigned driver from the dropdown
        const optionLocator = this.page.locator(
          `text=${vehicle.assignedDriver}`
        );
        await optionLocator.click();
      } else {
        console.log(
          `Driver field for Vehicle ${index + 1} does not exist on the page.`
        );
        break;
      }
    }
  }

  async deleteAllVehicles() {
    while (
      (await this.deleteVehicleButton.isVisible()) ||
      (await this.deleteOtherVehicleButton.isVisible())
    ) {
      if (await this.deleteVehicleButton.isVisible()) {
        await this.deleteVehicleButton.click();
      }
      if (await this.deleteOtherVehicleButton.isVisible()) {
        await this.deleteOtherVehicleButton.click();
      }
    }
  }

  async fillVehicleInfo(vin: string) {
    await this.vinField.fill(vin);
    await this.page.waitForTimeout(750);
  }

  async setOwnershipType(vehicles: { ownershipType: string }[]): Promise<void> {
    for (const [index, vehicle] of vehicles.entries()) {
      const ownershipTypeLocator = this.page.locator(
        `#input-ownershipType-${index}`
      );
      if ((await ownershipTypeLocator.count()) > 0) {
        await ownershipTypeLocator.selectOption(vehicle.ownershipType);
      } else {
        break; // Exit the loop once a field is not found
      }
    }
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
