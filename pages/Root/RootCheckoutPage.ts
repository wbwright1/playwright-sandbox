import { Page, Locator, FrameLocator } from "@playwright/test";
import { retry } from "../../tests/utils/retryUtils";

export class RootCheckoutPage {
  private heading: Locator;
  private monthlyPaymentSelector: Locator;
  private fullPaymentSelector: Locator;
  private cardHolderNameIframe: FrameLocator;
  private cardNumberIframe: FrameLocator;
  private expirationDateIframe: FrameLocator;
  private cvvIframe: FrameLocator;
  private nextStepButton: Locator
  private continueButton: Locator;

  constructor(private page: Page) {
    this.heading = page.getByRole("heading", { name: "Checkout" , exact: true});
    this.monthlyPaymentSelector = page.getByRole("button", { name: "Next Step" });
    this.fullPaymentSelector = page.locator('input[type="radio"][value="Full Pay"]');
    this.cardHolderNameIframe = page.frameLocator('iframe[name^="braintree-hosted-field-cardholderName"]'); //#braintree-hosted-field-cardholderName
    this.cardNumberIframe = page.frameLocator('iframe[name^="braintree-hosted-field-number"]');
    this.expirationDateIframe = page.frameLocator('iframe[name^="braintree-hosted-field-expirationDate"]');
    this.cvvIframe = page.frameLocator('iframe[name^="braintree-hosted-field-cvv"]');
    this.nextStepButton = page.getByRole("button", { name: "Next Step" });
    this.continueButton = page.getByRole("button", { name: "Continue to Checkout" });
  }

  async checkHeading() {
    await this.heading.waitFor({ state: "visible" , timeout: 120000 });
  }

  async clickNextStep() {
    await this.nextStepButton.click();
  }

  async selectMonthlyPay() {
    await this.monthlyPaymentSelector.click();
  }

  async selectFullPay() {
    await this.fullPaymentSelector.click();
  }

  async fillCreditCardInformation(cardDetails: {
    cardHolderName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  }): Promise<void> {
    // Fill Cardholder Name
    const cardHolderNameField = this.cardHolderNameIframe.locator('input#cardholder-name');
    await cardHolderNameField.fill(cardDetails.cardHolderName);

    // Fill Card Number
    const cardNumber = this.cardNumberIframe.locator('input#credit-card-number');
    await cardNumber.fill(cardDetails.cardNumber);
    //await this.cardNumberIframe.locator('.braintree-form-number').type(cardDetails.cardNumber);

    // Fill Expiration Date
    const cardExpirationDate = this.expirationDateIframe.locator('input#expiration');
    await cardExpirationDate.fill(cardDetails.expirationDate);
    //await this.expirationDateIframe.locator('.braintree-form-expirationDate').fill(cardDetails.expirationDate);

    // Fill CVV
    const cardCVV = this.cvvIframe.locator('input#cvv');
    await cardCVV.fill(cardDetails.cvv);
    //await this.cvvIframe.locator('.braintree-form-cvv').fill(cardDetails.cvv);
  }

  async fillCardHolderName(cardHolderName: string) {
    const frameLocator = this.page.frameLocator('.braintree-card.braintree-form.braintree-sheet iframe');
    await frameLocator.locator('.braintree-form-cardholder-name').waitFor({ state: 'visible' });
    await frameLocator.locator('.braintree-form-cardholder-name').fill(cardHolderName);;
  }

  async clickContinue(nextPageCheck: () => Promise<void>) {
      await this.continueButton.click();
      await nextPageCheck();
  }
}
