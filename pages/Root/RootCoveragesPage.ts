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
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  // Private method to select an option by label
  private async selectOptionByLocator(
    locator: Locator,
    optionValue: string
  ): Promise<void> {
    await locator.selectOption(optionValue);
  }

  // Public methods for interacting with the fields
  async setRideshare(value: string): Promise<void> {
    await this.selectOptionByLocator(this.rideshareField, value);
  }

  async setBodilyInjury(value: string): Promise<void> {
    await this.selectOptionByLocator(this.bodilyInjuryField, value);
  }

  async setPropertyDamage(value: string): Promise<void> {
    await this.selectOptionByLocator(this.propertyDamageField, value);
  }

  async setUninsuredUnderinsuredBodily(value: string): Promise<void> {
    await this.selectOptionByLocator(
      this.uninsuredUnderinsuredBodilyField,
      value
    );
  }

  async setUninsuredUnderinsuredPropertyDamage(value: string): Promise<void> {
    await this.selectOptionByLocator(
      this.uninsuredUnderinsuredPropertyDamageField,
      value
    );
  }

  async setPersonalInjuryProtection(value: string): Promise<void> {
    await this.selectOptionByLocator(this.personalInjuryProtectionField, value);
  }

  async setMedicalPayments(value: string): Promise<void> {
    await this.selectOptionByLocator(this.medicalPaymentsField, value);
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
