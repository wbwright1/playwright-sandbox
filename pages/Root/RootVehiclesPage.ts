import { Page, Locator } from "@playwright/test";
import { selectDropdownOptions } from "../../tests/utils/selectDropdownOptions"; // Adjust path if needed
import { selectDynamicDropdownOptions } from "../../tests/utils/selectDynamicDropdownOptions"; // Adjust path if needed

export class RootVehiclesPage {
  private heading: Locator;
  private deleteVehicleButton: Locator;
  private deleteOtherVehicleButton: Locator;
  private vinField: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Vehicle Review" });
    this.deleteVehicleButton = page.getByLabel("delete vehicle").nth(1);
    this.deleteOtherVehicleButton = page.getByLabel("delete vehicle").nth(2);
    this.vinField = page.locator('input[name="items.0.Vin"]');
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  // Modified setVehicleExclusionValues to use clicks instead of selectOption
  async setVehicleExclusionValues(
    discoveredVehicleStatus: string
  ): Promise<void> {
    const fieldsLocator = '[id^="input-vehicleExclusionSelect-"]';

    // Create an array of values to be selected
    const values = Array(await this.page.locator(fieldsLocator).count()).fill({
      value: discoveredVehicleStatus,
    });

    await selectDropdownOptions(this.page, fieldsLocator, values);
  }

  //Assign Drivers to Vehicles
  async assignDriversToVehicles(
    vehicles: { assignedDriver: string }[]
  ): Promise<void> {
    const fields = this.page.getByTestId("multi-select-button"); // Get the Locator for the dropdown fields
    await selectDynamicDropdownOptions(
      fields, // Pass the Locator
      vehicles.map((vehicle) => ({ value: vehicle.assignedDriver })) // Map assigned drivers to values
    );
  }

  // Delete all vehicles
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

  // Fill vehicle information
  async fillVehicleInfo(vin: string) {
    await this.vinField.fill(vin);
    await this.page.waitForTimeout(750);
  }

  // Modified setOwnershipType to use clicks instead of selectOption
  async setOwnershipType(vehicles: { ownershipType: string }[]): Promise<void> {
    for (const [index, vehicle] of vehicles.entries()) {
      const ownershipTypeLocator = this.page.locator(
        `#input-ownershipType-${index}`
      );

      // Check if the field exists on the page
      if ((await ownershipTypeLocator.count()) > 0) {
        // Click the dropdown to open it
        await ownershipTypeLocator.click();

        // Click the option for ownership type
        const optionLocator = this.page.locator(
          `text="${vehicle.ownershipType}" >> nth=${index}`
        );
        await optionLocator.click();
      } else {
        break; // Exit the loop once a field is not found
      }
    }
  }

  // Click Continue
  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
