import { Page, Locator } from "@playwright/test";

export class AviatorPriorPolicyPage {
  private heading: Locator;
  private priorCarrierDropdown: Locator;
  private yearsWithCarrierField: Locator;
  private liabilityLimitsDropdown: Locator;
  private submitButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Prior Auto Policy" });
    this.priorCarrierDropdown = page.locator('select[name="prior_carrier"]');
    this.yearsWithCarrierField = page.locator(
      'input[name="years_with_prior_carrier"]'
    );
    this.liabilityLimitsDropdown = page.locator(
      'select[name="prior_liability_limits"]'
    );
    this.submitButton = page.getByTitle("Submit");
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" });
  }

  async fillPriorPolicyInfo(carrier: string, years: string, limits: string) {
    await this.priorCarrierDropdown.selectOption({ value: carrier });
    await this.yearsWithCarrierField.fill(years);
    await this.liabilityLimitsDropdown.selectOption({ value: limits });
  }

  async clickSubmit(nextPageCheck: () => Promise<void>) {
    await this.submitButton.click();
    await nextPageCheck();
  }
}
