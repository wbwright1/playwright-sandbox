import { Page, Locator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class RootBasicInformationPage {
  private heading: Locator;
  private address1Field: Locator;
  private address2Field: Locator;
  private cityField: Locator;
  private stateDropdown: Locator;
  private zipField: Locator;
  private emailField: Locator;
  private phoneNumberField: Locator;
  private homeownerStatusDropdown: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Basic Information" });
    this.address1Field = page.getByLabel("Address 1 (Optional)");
    this.address2Field = page.getByLabel("Address 2 (Optional)");
    this.cityField = page.getByLabel("City (Optional)");
    this.stateDropdown = page.getByLabel("State (Optional)");
    this.zipField = page.getByLabel("ZIP Code (Optional)");
    this.emailField = page.getByLabel("Email Address");
    this.phoneNumberField = page.getByPlaceholder("Phone Number");
    this.homeownerStatusDropdown = page.getByLabel(
      "What is the homeowner status"
    );
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async fillClientInfo(email: string, phoneNumber: string) {
    await this.emailField.fill(email);
    await this.phoneNumberField.fill(phoneNumber);
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
