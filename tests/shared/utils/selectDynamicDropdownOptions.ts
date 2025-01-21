import { Page, Locator } from "@playwright/test";

async function selectDynamicDropdownOptions(
  fields: Locator,
  values: { value: string }[]
): Promise<void> {
  const totalFields = await fields.count();
  if (totalFields === 0) {
    console.log("No fields available to set.");
    return;
  }

  for (let i = 0; i < totalFields; i++) {
    const field = fields.nth(i);
    await field.click(); // Open the dropdown

    // Locate the option by its text content
    const optionLocator = fields.page().locator(`text="${values[i].value}"`);
    if ((await optionLocator.count()) > 0) {
      await optionLocator.click();
      console.log(`Set field ${i + 1} to value: ${values[i].value}`);
    } else {
      console.log(`Option "${values[i].value}" not found for field ${i + 1}`);
    }
  }
}

export { selectDynamicDropdownOptions };
