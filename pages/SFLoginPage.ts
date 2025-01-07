import { Page, Locator } from '@playwright/test';

export class SFLoginPage {
    private loginButton: Locator;
    private usernameField: Locator;
    private passwordField: Locator;

    constructor(private page: Page) {
        // Initialize the login button using getByRole
        this.loginButton = page.getByRole('button', { name: 'Log In to Sandbox' });
        this.usernameField = page.getByLabel('Username'); // Example for username field
        this.passwordField = page.getByLabel('Password'); // Example for password field
    }

    async navigateToLogin() {
        await this.page.goto('https://uat.agent-quotes.goosehead.com/');
    }

    async login(username: string, password: string) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click(); // Use the `loginButton` locator
    }
}
