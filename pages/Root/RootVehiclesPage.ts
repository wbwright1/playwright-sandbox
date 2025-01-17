import { Page, Locator } from "@playwright/test";
import { selectDropdownOptions } from "../../tests/utils/selectDropdownOptions"; // Adjust path if needed
import { selectDynamicDropdownOptions } from "../../tests/utils/selectDynamicDropdownOptions"; // Adjust path if needed

type Vehicle = {
  vin: string;
  make: string;
  model: string;
  year: number;
  vehicleStatus: string;
  assignedDriver: string; // This will map to a driver's name, e.g., "Richard King"
  ownershipType: string;
  garagingAddress?: string,
  lienholder?: string,
  antiTheft: string,
  vinEtching: string,
};

export class RootVehiclesPage {
  private heading: Locator;
  private addVehicleButton: Locator;
  private deleteVehicleButton: Locator;
  private deleteOtherVehicleButton: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Vehicle Review" });
    this.addVehicleButton = page.getByTestId('content-container-component').getByTestId('add-button');
    this.deleteVehicleButton = page.getByLabel("delete vehicle").nth(1);
    this.deleteOtherVehicleButton = page.getByLabel("delete vehicle").nth(2);
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async addVehicles(vehicleOrVehicles: Vehicle | Vehicle[]) {
    const vehicles = Array.isArray(vehicleOrVehicles) ? vehicleOrVehicles : [vehicleOrVehicles];
  
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
  
      if (i > 0) {
        // Add a new vehicle button click only for subsequent vehicles
        await this.addVehicleButton.click();
        await this.page.waitForTimeout(500); // Optional: Wait for UI update
      }
      // Fill vehicle information
      await this.fillVehicleInfo(vehicle, i); // Adjust index to match locators
    }
  }

  async fillVehicleInfo(vehicle: Vehicle, index: number = 0) {
  
    if (index > 0) {
      await this.page.fill(`input[id="input-vin-${index}"]`, vehicle.vin);
      await this.page.getByText("Vehicle Information").click(); // Click to allow next options to be clicked
    }  

    // Assigned Driver dropdown
    await this.page.getByTestId("multi-select-button").nth(index).click();
    await this.page.getByText(`${vehicle.assignedDriver}`, {
      exact: true,
    }).click();
  
    // Coverage Status dropdown
    if (index > 0) {
      await this.page.locator(`button[id="input-coverageStatus-${index}"]`).click();
      await this.page.getByLabel(`${vehicle.vehicleStatus}`).click(); 
    }

    // Ownership Type dropdown
    await this.page.locator(`button[id="input-ownershipType-${index}"]`).click();
    await this.page.getByLabel(`${vehicle.ownershipType}`, {
      exact: true,
    }).click();
  
    // Garaging Address input
    if (vehicle.garagingAddress?.trim() != null && vehicle.garagingAddress != "8607 Concerto Cir") {
      await this.page.locator(`button[id="input-garagingAddr-${index}"]`).click();
      await this.page.getByLabel(`Different from Primary`).click();
      await this.page.fill(`input[id="input-garagingAddr-${index}"]`, vehicle.garagingAddress);
    } else {
      await this.page.locator(`button[id="input-garagingAddr-${index}"]`).click();
      await this.page.getByLabel(`Same as Primary`).click();
    }
  
    // Lienholder input
    if (vehicle.lienholder?.trim() != null && vehicle.ownershipType != "Own") {
      await this.page.fill(`input[id="input-lienholderInput-${index}"]`, vehicle.lienholder);
    }
  
    // Anti-Theft dropdown
    await this.page.locator(`button[id="input-antiTheftEquipment-${index}"]`).click();
    await this.page.getByLabel(`${vehicle.antiTheft}`).click();
  
    // VIN Etching dropdown
    await this.page.locator(`button[id="input-vinEtching-${index}"]`).click();
    await this.page.getByLabel(`${vehicle.vinEtching}`).click();
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

  // Click Continue
  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
