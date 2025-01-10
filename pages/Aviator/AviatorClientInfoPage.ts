import { Page, Locator } from "@playwright/test";

export class AviatorClientInfoPage {
  private firstNameField: Locator;
  private lastNameField: Locator;
  private dobField: Locator;
  private genderDropdown: Locator;
  private maritalStatusDropdown: Locator;
  private phoneField: Locator;
  private emailField: Locator;
  private continueButton: Locator;

  constructor(private page: Page) {
    this.firstNameField = page.getByLabel("First Name");
    this.lastNameField = page.getByLabel("Last Name");
    this.dobField = page.getByLabel("Date of Birth");
    this.genderDropdown = page.getByLabel("Gender");
    this.maritalStatusDropdown = page.getByLabel("Marital Status");
    this.phoneField = page.getByPlaceholder("(555) 123-4567");
    this.emailField = page.getByPlaceholder("username@email.com");
    this.continueButton = page.getByRole("button", { name: "Continue" });
  }

  async fillClientInfo(
    firstName: string,
    lastName: string,
    dob: string,
    email: string
  ) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.dobField.type(dob);
    await this.emailField.type(email);
  }

  async selectGender(gender: string) {
    await this.genderDropdown.selectOption(gender);
  }

  async selectMaritalStatus(status: string) {
    await this.maritalStatusDropdown.selectOption(status);
  }

  async fillPhoneNumber(phone: string) {
    await this.phoneField.fill(phone);
  }

  // async clickContinue() {
  //     await this.continueButton.click();
  // }

  async clickContinue(nextPageCheck: () => Promise<void>) {
    await this.continueButton.click();
    await nextPageCheck();
  }
}
