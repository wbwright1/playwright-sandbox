import { Page, Locator } from "@playwright/test";
import { retry } from "../utils/retryUtils";

export class SFLoginPage {
  private loginButton: Locator;
  private usernameField: Locator;
  private passwordField: Locator;

  constructor(private page: Page) {
    // Initialize the login button using getByRole
    this.loginButton = page.getByRole("button", { name: "Log In to Sandbox" });
    this.usernameField = page.getByLabel("Username"); // Example for username field
    this.passwordField = page.getByLabel("Password"); // Example for password field
  }

  async navigateToDevLogin() {
    await this.page.goto("https://dev.agent-quotes.goosehead.com/");
  }

  async navigateToUATLogin() {
    await this.page.goto("https://uat.agent-quotes.goosehead.com/");
  }

  async navigateToTestLogin() {
    await this.page.goto("https://test.agent-quotes.goosehead.com/");
  }

  async navigateToPreprodLogin() {
    await this.page.goto(
      "https://preprod.agent-quotes.goosehead.com/agent/Auto/Responses"
    );
  }

  async login(username: string, password: string) {
    await retry(async () => {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.loginButton.click(); // Use the `loginButton` locator

      // Wait for navigation or a specific element on the next page
      // If this fails, it will throw an error and trigger a retry
      await this.page.waitForNavigation({ timeout: 5000 });
      // Or wait for a specific element on the next page, e.g.:
      // await this.page.waitForSelector('selector-for-element-on-next-page', { timeout: 5000 });
    });
  }
}
