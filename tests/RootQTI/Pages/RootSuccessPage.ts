import { Page, Locator } from "@playwright/test";

export class RootSuccessPage {
  private heading: Locator;
  private disclaimerCheckbox: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Success!" });
    this.disclaimerCheckbox = page.getByRole("checkbox");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async checkConsumerDisclosure() {
    await this.disclaimerCheckbox.click();
  }

  async clickContinueAndRunReports(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
