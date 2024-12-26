import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Aviator Login', async ({ page }) => {
  // UAT environment login url from .env
  // await page.goto(process.env.LOGIN_URL);
  await page.goto('https://uat.agent-quotes.goosehead.com/');
  await page.getByLabel('Username').click();
  // UAT environment username from .env
  // await page.goto(process.env.USERNAME);
  await page.getByLabel('Username').fill('automation.testing@goosehead.com.uat');
  await page.getByLabel('Password').click();
  // UAT environment password from .env
  // await page.goto(process.env.PASSWORD);
  await page.getByLabel('Password').fill('GHnov2022$');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
});

test('Aviator - Single Driver / Single Vehicle', async ({ page }) => {
  // UAT environment login url from .env
  // await page.goto(process.env.LOGIN_URL);
  await page.goto('https://uat.agent-quotes.goosehead.com/');
  await page.getByLabel('Username').click();
  // UAT environment username from .env
  // await page.goto(process.env.USERNAME);
  await page.getByLabel('Username').fill('automation.testing@goosehead.com.uat');
  await page.getByLabel('Password').click();
  // UAT environment password from .env
  // await page.goto(process.env.PASSWORD);
  await page.getByLabel('Password').fill('GHnov2022$');
  await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

  const addressField = await page.getByPlaceholder('123 Main St., Dallas, TX 75201');
  await addressField.fill('8607 Concerto Cir');
  //await page.getByPlaceholder('123 Main St., Dallas, TX 75201').fill('8607 Concerto Cir');
  // Needs work to stay consistent, will sometimes not show any dropdown options

  let listItemFound = false;
  const maxRetries = 10;  // To avoid infinite loops, set a max number of retries
  let retries = 0;

  const listItem = await page.locator('ul > li:first-child');
  // Stores first option from dynamic list (address search in this case)


  while (!listItemFound && retries < maxRetries) {
    // Check if the first child list item exists
    await addressField.clear();
    await addressField.fill('8607 Concerto Cir');

    listItemFound = await listItem.isVisible();
    // If it's not found, wait for a bit and then retry
    if (!listItemFound) {
      console.log('List item not found, retrying...');
      await page.waitForTimeout(500); // Wait for 500ms before checking again
    }

    retries++;
  }

  await listItem.click();
  // Clicks on the item that we stored previously to select the address

  await page.selectOption('#leadSource', { index: 2 });
  // Uses the id of the field to then select the option in the dropdown based on the index

  await page.getByRole('button', { name: 'Let’s Do This' }).click();
  // Note: You specifically need to use the ’ character to make this button work

  await page.getByText('Only Quote Auto').click();

  await page.getByLabel('First Name').clear();
  await page.getByLabel('First Name').fill('Richard');
  // Cleared First Name field initially in case there was a default included
  await page.getByLabel('Last Name').clear();
  await page.getByLabel('Last Name').fill('King');
  // Cleared Last Name field initially in case there was a default included

  await page.getByLabel('Date of Birth').type('01/01/1944');
  // .fill does not work due to the MM/DD/YYYY input there

  await page.getByLabel('Gender').selectOption('Male');
  await page.getByLabel('Marital Status').selectOption('Single');

  await page.getByPlaceholder('(555) 123-4567').type('55555555555');
  // Added an extra digit as one would be lost in the execution
  
  await page.getByPlaceholder('username@email.com').type('test@test.com');
  // Needs to be randomized for Root

  await page.getByRole('button', { name: 'Continue' }).click();
});