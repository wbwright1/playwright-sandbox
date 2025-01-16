import { Page, Locator } from "@playwright/test";

export class RootCoveragesPage {
  private page: Page;

  // Private variables for each field
  private heading: Locator;
  private rideshareField: Locator;
  private bodilyInjuryField: Locator;
  private propertyDamageField: Locator;
  private uninsuredUnderinsuredBodilyField: Locator;
  private uninsuredUnderinsuredPropertyDamageField: Locator;
  private personalInjuryProtectionField: Locator;
  private medicalPaymentsField: Locator;
  private continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators for all fields
    this.heading = page.getByRole("heading", { name: "Details" });
    this.rideshareField = this.page.getByLabel("Rideshare");
    this.bodilyInjuryField = this.page.getByLabel("Bodily Injury", {
      exact: true,
    });
    this.propertyDamageField = this.page.getByLabel("Property Damage", {
      exact: true,
    });
    this.uninsuredUnderinsuredBodilyField = this.page.getByLabel(
      "Uninsured/Underinsured Bodily Injury"
    );
    this.uninsuredUnderinsuredPropertyDamageField = this.page.getByLabel(
      "Uninsured/Underinsured Property Damage"
    );
    this.personalInjuryProtectionField = this.page.getByLabel(
      "Personal Injury Protection"
    );
    this.medicalPaymentsField = this.page.getByLabel("Medical Payments");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  // Private method to click and select an option by label text
  private async clickOptionByLocator(
    locator: Locator,
    optionText: string
  ): Promise<void> {
    // Click the dropdown (button)
    await locator.click();

    // Click on the option that matches the optionText
    await this.page.locator(`text="${optionText}"`).click();
  }

  // Public methods for interacting with the fields
  async setRideshare(value: string): Promise<void> {
    await this.clickOptionByLocator(this.rideshareField, value);
  }

  async setBodilyInjury(value: string): Promise<void> {
    await this.clickOptionByLocator(this.bodilyInjuryField, value);
  }

  async setPropertyDamage(value: string): Promise<void> {
    await this.clickOptionByLocator(this.propertyDamageField, value);
  }

  async setUninsuredUnderinsuredBodily(value: string): Promise<void> {
    await this.clickOptionByLocator(
      this.uninsuredUnderinsuredBodilyField,
      value
    );
  }

  async setUninsuredUnderinsuredPropertyDamage(value: string): Promise<void> {
    await this.clickOptionByLocator(
      this.uninsuredUnderinsuredPropertyDamageField,
      value
    );
  }

  async setPersonalInjuryProtection(value: string): Promise<void> {
    await this.clickOptionByLocator(this.personalInjuryProtectionField, value);
  }

  async setMedicalPayments(value: string): Promise<void> {
    await this.clickOptionByLocator(this.medicalPaymentsField, value);
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
