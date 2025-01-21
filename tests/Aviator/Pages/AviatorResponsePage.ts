import { Page, Locator } from "@playwright/test";

export class AviatorResponsePage {
  private heading: Locator;
  private progressiveContainer: Locator;
  private rootContainer: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("button", { name: "Summary" });
    this.progressiveContainer = page.getByRole("button", {
      name: /Progressive Progressive/,
    });
    this.rootContainer = page.getByRole("button", { name: /Root Root/ });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async waitForProgressiveQuote() {
    await this.progressiveContainer.waitFor({ state: "visible" });
  }

  async openProgressiveQTI(nextPageCheck: () => Promise<void>) {
    const priceButton = this.progressiveContainer.getByRole("button", {
      name: /\$\d+\/mo/,
      exact: false,
    });
    await priceButton.click();
    await nextPageCheck();
  }

  async waitForRootQuote() {
    await this.rootContainer.waitFor({ state: "visible" });
  }

  async openRootQTI() {
    const priceButton = this.rootContainer.getByRole("button", {
      name: /\$\d+\/mo/,
      exact: false,
    });
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"), // Listen for a new page event
      priceButton.click(), // Click the button that opens a new tab
    ]);

    // Wait for the new page to load completely
    await newPage.waitForLoadState("domcontentloaded");

    // To close the Aviator page, you can use this section of code
    // const pages = this.page.context().pages();
    // for (const page of pages) {
    //   if (page !== newPage) {
    //     await page.close();
    //   }
    // }

    return newPage; // Return the new page for further interactions
  }
}
