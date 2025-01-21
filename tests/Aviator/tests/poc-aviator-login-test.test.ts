import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { SFLoginPage } from "../../shared/Pages/SFLoginPage";

//dotenv.config({ path: path.resolve(__dirname, '../.env') });

test("test", async ({ page }) => {
  // UAT environment login url from .env
  // await page.goto(process.env.LOGIN_URL);
  await page.goto("https://uat.agent-quotes.goosehead.com/");
  await page.getByLabel("Username").click();
  // UAT environment username from .env
  // await page.goto(process.env.USERNAME);
  await page
    .getByLabel("Username")
    .fill("automation.testing@goosehead.com.uat");
  await page.getByLabel("Password").click();
  // UAT environment password from .env
  // await page.goto(process.env.PASSWORD);
  await page.getByLabel("Password").fill("GHnov2022$");
  await page.getByRole("button", { name: "Log In to Sandbox" }).click();
});

test("Login using Page file", async ({ page }) => {
  const loginPage = new SFLoginPage(page);

  await loginPage.navigateToUATLogin();
  await loginPage.login("automation.testing@goosehead.com.uat", "GHnov2022$");

  // Add assertions to verify successful login
  await expect(
    page.getByRole("button", { name: "Let’s Do This" })
  ).toBeVisible();
});
