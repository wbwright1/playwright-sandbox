import { Page, Locator } from "@playwright/test";

export class AviatorVehiclesPage {
  private heading: Locator;
  private deleteVehicleButton: Locator;
  private deleteOtherVehicleButton: Locator;
  private vinField: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", {
      name: "Vehicles",
    });
    this.deleteVehicleButton = page.getByLabel("delete vehicle").nth(1);
    this.deleteOtherVehicleButton = page.getByLabel("delete vehicle").nth(2);
    this.vinField = page.locator('input[name="items.0.Vin"]');
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
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

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
