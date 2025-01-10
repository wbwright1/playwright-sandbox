import { Page, Locator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class AviatorAddressPage {
  private addressField: Locator;
  private firstListItem: Locator;
  private leadSourceDropdown: Locator;
  private letsDoThisButton: Locator;
  private onlyQuoteAutoButton: Locator;

  constructor(private page: Page) {
    this.addressField = page.getByPlaceholder("123 Main St., Dallas, TX 75201");
    this.firstListItem = page.locator("ul > li:first-child");
    this.leadSourceDropdown = page.getByLabel("Lead Source Type");
    this.letsDoThisButton = page.getByRole("button", { name: "Let’s Do This" });
    this.onlyQuoteAutoButton = page.getByText("Only Quote Auto");
  }

  async fillAddressPageWithRetry(address: string, leadSourceIndex: number) {
    await retry(async () => {
      await this.fillAddressWithRetry(address);
      await this.selectFirstAddressOption();
      await this.selectLeadSource(leadSourceIndex);
      await this.clickLetsDoThis();

      // Wait for navigation or a specific element on the next page
      await this.page.waitForNavigation({ timeout: 5000 });

      // Check if we're on the correct page after navigation
      if (!(await this.onlyQuoteAutoButton.isVisible({ timeout: 2000 }))) {
        throw new Error("Navigation to the next page failed");
      }

      // Can be removed to separate out progression to the next page
      await this.clickOnlyQuoteAuto();
    });
  }

  async fillAddress(address: string) {
    await this.addressField.clear();
    await this.addressField.fill(address);
  }

  // async fillAddressWithRetry(address: string, maxRetries = 10, retryDelay = 3000) {
  //     for (let attempt = 0; attempt < maxRetries; attempt++) {
  //         await this.fillAddress(address);

  //         // Wait for a short time to allow the options to load
  //         await this.page.waitForTimeout(500);

  //         if (await this.firstListItem.isVisible()) {
  //             return; // Options are visible, exit the retry loop
  //         }

  //         if (attempt < maxRetries - 1) {
  //             await this.page.waitForTimeout(retryDelay);
  //         }
  //     }
  //     throw new Error(`Address options did not appear after ${maxRetries} attempts`);
  // }

  async fillAddressWithRetry(address: string) {
    await retry(async () => {
      await this.fillAddress(address);
      await this.page.waitForTimeout(500);
      if (!(await this.firstListItem.isVisible())) {
        throw new Error("Address options did not appear");
      }
    });
  }

  async selectFirstAddressOption() {
    await this.firstListItem.click();
  }

  async selectLeadSource(index: number) {
    await this.leadSourceDropdown.selectOption({ index });
  }

  async clickLetsDoThis() {
    await this.letsDoThisButton.click();
  }

  async clickOnlyQuoteAuto() {
    await this.onlyQuoteAutoButton.click();
  }
}
