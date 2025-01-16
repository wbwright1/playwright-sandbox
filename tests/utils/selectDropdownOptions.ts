import { Page, Locator } from "@playwright/test";

/**
 * Utility function to select options from a dropdown list for various fields.
 * @param page - The Playwright Page instance.
 * @param fieldLocator - The locator for the dropdown field.
 * @param values - An array of values to be selected from the dropdown options.
 */
async function selectDropdownOptions(
  page: Page,
  fieldLocator: string,
  values: { value: string }[]
): Promise<void> {
  const fields = page.locator(fieldLocator);

  // Get the total number of matching fields
  const totalFields = await fields.count();

  if (totalFields === 0) {
    console.log("No fields available to set.");
    return;
  }

  // Iterate through all fields and set the value by clicking the dropdown and selecting the value
  for (let i = 0; i < totalFields; i++) {
    const field = fields.nth(i);

    // Click the field to open the dropdown
    await field.click();

    // Ensure the correct option is selected based on the passed values
    const optionLocator = page.locator(`text="${values[i].value}" >> nth=${i}`);
    console.log(`Setting field ${i + 1} to: ${values[i].value}`);
    await optionLocator.click();
  }
}

export { selectDropdownOptions };
