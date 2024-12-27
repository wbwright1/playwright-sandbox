import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

//dotenv.config({ path: path.resolve(__dirname, '../.env') });

test('test', async ({ page }) => {
  // UAT environment login url from .env
  // await page.goto(process.env.LOGIN_URL);
  await page.goto('https://uat.agent-quotes.goosehead.com/');
  await page.getByLabel('Username').click();
  // UAT environment username from .env
  // await page.goto(process.env.USERNAME);
  await page.getByLabel('Username').fill('automation.testing@goosehead.com');
  await page.getByLabel('Password').click();
  // UAT environment password from .env
  // await page.goto(process.env.PASSWORD);
  await page.getByLabel('Password').fill('GHnov2022$');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
});