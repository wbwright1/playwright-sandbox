import { Page, Locator } from '@playwright/test';

export class AviatorVehiclesPage {
    private deleteVehicleButton: Locator;
    private vinField: Locator;
    private continueButton: Locator;

    constructor(private page: Page) {
        this.deleteVehicleButton = page.getByRole('button', { name: 'delete vehicle' });
        this.vinField = page.locator('input[name="items.0.Vin"]');
        this.continueButton = page.getByRole('button', { name: 'Continue'});
    }

    async deleteAllVehicles() {
        while (await this.deleteVehicleButton.isVisible()) {
            await this.deleteVehicleButton.click();
        }
    }

    async fillVehicleInfo(vin: string) {
        await this.vinField.fill(vin);
        await this.page.waitForTimeout(750);
    }

    async clickContinue() {
        await this.continueButton.click();
    }
}
