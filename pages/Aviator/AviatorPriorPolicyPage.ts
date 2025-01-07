import { Page, Locator } from '@playwright/test';

export class AviatorPriorPolicyPage {
    private priorCarrierDropdown: Locator;
    private yearsWithCarrierField: Locator;
    private liabilityLimitsDropdown: Locator;
    private submitButton: Locator;

    constructor(private page: Page) {
        this.priorCarrierDropdown = page.locator('select[name="prior_carrier"]');
        this.yearsWithCarrierField = page.locator('input[name="years_with_prior_carrier"]');
        this.liabilityLimitsDropdown = page.locator('select[name="prior_liability_limits"]');
        this.submitButton = page.getByTitle('Submit');
    }

    async fillPriorPolicyInfo(carrier: string, years: string, limits: string) {
        await this.priorCarrierDropdown.selectOption({ value: carrier });
        await this.yearsWithCarrierField.fill(years);
        await this.liabilityLimitsDropdown.selectOption({ value: limits });
    }

    async clickSubmit() {
        await this.submitButton.click();
    }
}
