import { Page, Locator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class RootPolicySummaryPage {
  private heading: Locator;
  private continueButton: Locator;
  private disclaimerCheckbox: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Policy Summary" });
    this.disclaimerCheckbox = page.getByRole("checkbox");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async checkConsumerDisclosure() {
    await this.disclaimerCheckbox.click();
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
