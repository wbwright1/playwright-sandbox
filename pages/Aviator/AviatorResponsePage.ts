import { Page, Locator } from '@playwright/test';

export class AviatorResponsePage {
    private progressiveQuoteCard: Locator;

    constructor(private page: Page) {
        this.progressiveQuoteCard = page.getByRole('button', { name: /Progressive Progressive/ });
    }

    async waitForProgressiveQuote() {
        await this.progressiveQuoteCard.waitFor({ state: 'visible' });
    }
}
