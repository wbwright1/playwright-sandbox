import { Page, Locator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class RootPolicySummaryPage {
  private heading: Locator;
  private disclaimerCheckbox: Locator;
  private continueButton: Locator;
  private continueToCheckoutButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Policy Summary" });
    this.disclaimerCheckbox = page.getByRole("checkbox");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  async checkConsumerDisclosure() {
    await this.disclaimerCheckbox.click();
  }

  async clickContinueAndRunReports(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
