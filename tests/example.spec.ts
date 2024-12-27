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

  // -------------------------------------------- Address Page --------------------------------------------
  // Setting variables for loops to solve for Aviator login inconsistencies
  let addressPagePassed = false;
  const pageMaxRetries = 10;  // To avoid infinite loops, set a max number of retries
  let pageRetries = 0;

  // Loop for if SF Login is needed again
  while (!addressPagePassed && pageRetries < pageMaxRetries) {
    // Check if the first child list item exists
    const addressField = await page.getByPlaceholder('123 Main St., Dallas, TX 75201');

    await addressField.clear();
    await addressField.fill('8607 Concerto Cir');

    const listItem = await page.locator('ul > li:first-child');
    // Stores first option from dynamic list (address search in this case)

    // Setting variables for loop to fix typeahead options
    let listItemFound = false;
    const addressMaxRetries = 10;  // To avoid infinite loops, set a max number of retries
    let addressRetries = 0;

    // Loop for if the typeahead field doesn't load initially
    while (!listItemFound && addressRetries < addressMaxRetries) {
      // Check if the first child list item exists
      await addressField.clear();
      await addressField.fill('8607 Concerto Cir');

      listItemFound = await listItem.isVisible();
      // If it's not found, wait for a bit and then retry
      if (!listItemFound) {
        await page.waitForTimeout(750); // Wait for 500ms before checking again
      }
      addressRetries++;
    }

    await listItem.click();
    // Selects the address from the dropdown

    await page.selectOption('#leadSource', { index: 2 });
    // Uses the id of the field to then select the option in the dropdown based on the index

    await page.getByRole('button', { name: 'Let’s Do This' }).click();
    // Note: You specifically need to use the ’ character to make this button work */

    await page.waitForNavigation({ timeout: 5000 });
    // Note: Included to allow the page to load between SF login and the following page
    addressPagePassed = await page.isVisible("text='Only Quote Auto'")

    // If it's not found, wait for a bit and then retry
    if (!addressPagePassed) {
      await page.waitForTimeout(5000); // Wait for 500ms before checking again
    }

    if (addressPagePassed) {
      await page.getByText('Only Quote Auto').click();
    }

    pageRetries++;
  }

  // -------------------------------------------- Client Info Page --------------------------------------------

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

  // -------------------------------------------- Driver Page --------------------------------------------

  // Storing the delete driver button in a variable to loop through and delete any defaults
  const deleteDriverButton = page.getByRole('button', { name: 'delete driver' });

  // Looping and deleting all extra drivers
  while ( await deleteDriverButton.isVisible()) {
    await deleteDriverButton.click();
  }

  // Sometimes Aviator will have a license defaulted, need to check if it is defaulted
  const driverLicenseField = page.locator('input[name="items.0.driverLicense"]');
  const driverLicenseValue = await driverLicenseField.inputValue();
  
  // Checking if license is defaulted and clearing if so
  if (driverLicenseValue.trim() !== '') {
    await driverLicenseField.clear();
  }

  // Filling out driver information
  await page.fill('input[name="items.0.driverLicense"]','00000004');
  await page.selectOption('select[name="items.0.dLState"]', { value: 'TX' });
  await page.selectOption('select[name="items.0.education"]', { value: 'Some College' });

  // Driver Occupations are typeahead fields that require more work, no values are present
  const driverOccupation = await page.locator('.type-ahead-select__input-container').first();
  driverOccupation.click();
  await page.keyboard.press('Enter');

  await page.getByRole('button', { name: 'Continue'}).click();

// -------------------------------------------- Vehicle Page --------------------------------------------

  // Storing the delete vehicle button in a variable to loop through and delete any defaults
  const deleteVehicleButton = page.getByRole('button', { name: 'delete vehicle' });

// Looping and deleting all extra vehicles
  while ( await deleteVehicleButton.isVisible()) {
    await deleteVehicleButton.click();
  }

  //await page.getByRole('button', { name: 'Add Vehicle'}).click(); - For whenever we want to add a vehicle

  await page.fill('input[name="items.0.Vin"]','JH4DA9340NS001774');

  // Adding a wait for the VIN decoder to complete
  await page.waitForTimeout(750);

  //await page.getByTitle('Continue').click(); - For some reason it is continuing without this. Not sure why this is happening
  
  // -------------------------------------------- Prior Policy Page --------------------------------------------

  // Filling out prior policy information
  await page.selectOption('select[name="prior_carrier"]', { value: 'Allstate'});
  await page.fill('input[name="years_with_prior_carrier"]','3');
  await page.selectOption('select[name="prior_liability_limits"]', { value: '100/300'});

  await page.getByTitle('Submit').click();

  // -------------------------------------------- Results Page --------------------------------------------

  // Wait for Progressive to show up in Aviator Results
  await page.locator('#quote-card-info-auto-progressive-false').waitFor({ state: 'visible' });

});