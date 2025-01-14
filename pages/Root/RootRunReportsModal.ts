import { Page, Locator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class RootRunReportsModal {
  private heading: Locator;
  private editQuoteButton: Locator;
  private returnToAviatorQuotesButton: Locator;
  private continueToCheckoutButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Here is the final rate!" });
    this.editQuoteButton = page.getByRole("button", { name: "Edit Quote" });
    this.returnToAviatorQuotesButton = page.getByText("Return to Aviator Quotes");
    this.continueToCheckoutButton = page.getByRole("button", { name: "Continue to Checkout" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  async clickEditQuote() {
    await this.editQuoteButton.click();
  }

  async returnToAviator() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"), // Listen for a new page event
      this.returnToAviatorQuotesButton.click(), // Click the button that opens a new tab
    ]);

    // Wait for the new page to load completely
    await newPage.waitForLoadState("domcontentloaded");

    // To close the QTI page, you can use this section of code
    // const pages = this.page.context().pages();
    // for (const page of pages) {
    //   if (page !== newPage) {
    //     await page.close();
    //   }
    // }

    return newPage; // Return the new page for further interactions
  }

  async clickContinueToCheckout(nextPageCheck: () => Promise<void>) {
      await this.continueToCheckoutButton.click();
      await nextPageCheck();
  }
}
