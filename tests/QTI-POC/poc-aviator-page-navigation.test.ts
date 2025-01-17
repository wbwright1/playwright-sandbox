import { test, expect } from "./fixtures/pocTestDataFixture";
import { SFLoginPage } from "../../pages/SFLoginPage";
import {
  AviatorAddressPage,
  AviatorClientInfoPage,
  AviatorDriversPage,
  AviatorVehiclesPage,
  AviatorPriorPolicyPage,
  AviatorResponsePage,
} from "../../pages/Aviator";

test("Aviator - Single Driver / Single Vehicle", async ({ page, testData }) => {
  test.setTimeout(60000);

  const sfLoginPage = new SFLoginPage(page);
  const aviatorAddressPage = new AviatorAddressPage(page);
  const aviatorClientInfoPage = new AviatorClientInfoPage(page);
  const aviatorDriversPage = new AviatorDriversPage(page);
  const aviatorVehiclesPage = new AviatorVehiclesPage(page);
  const aviatorPriorPolicyPage = new AviatorPriorPolicyPage(page);
  const aviatorResponsePage = new AviatorResponsePage(page);

  await sfLoginPage.navigateToUATLogin();
  await sfLoginPage.login("automation.testing@goosehead.com.uat", "GHnov2022$");

  await aviatorAddressPage.fillAddressPageWithRetry(testData.address, 2);
  //   await aviatorAddressPage.selectFirstAddressOption();
  //   await aviatorAddressPage.selectLeadSource(2);
  //   await aviatorAddressPage.clickLetsDoThis();
  //   await page.waitForNavigation({ timeout: 5000 });
  //   await aviatorAddressPage.clickOnlyQuoteAuto();

  await aviatorClientInfoPage.fillClientInfo(
    testData.firstName,
    testData.lastName,
    testData.dob,
    testData.email,
    testData.phone
  );
  await aviatorClientInfoPage.selectGender(testData.gender);
  await aviatorClientInfoPage.selectMaritalStatus(testData.maritalStatus);
  await aviatorClientInfoPage.fillPhoneNumber(testData.phone);

  // Sending next expected page so it will wait for it to load prior to running next step
  await aviatorClientInfoPage.clickContinue(() =>
    aviatorDriversPage.checkHeading()
  );
  //await aviatorClientInfoPage.clickContinue();

  await aviatorDriversPage.deleteAllDrivers();
  await aviatorDriversPage.fillPrimaryDriverInfo(
    testData.driverLicense,
    testData.dLState,
    testData.education
  );
  await aviatorDriversPage.selectPrimaryOccupation();
  //   await page.getByRole('button', { name: 'add driver' }).click();
  //   await aviatorDriversPage.addMultipleDrivers([
  //           {
  //               firstName: 'John',
  //               lastName: 'Doe',
  //               dob: '01/01/1980',
  //               gender: 'Male',
  //               license: '00000001',
  //               state: 'TX',
  //               education: 'Some College'
  //           },
  //           {
  //               firstName: 'Jane',
  //               lastName: 'Smith',
  //               dob: '02/15/1985',
  //               gender: 'Female',
  //               suffix: 'Jr',
  //               license: '00000002',
  //               state: 'CA',
  //               education: 'Bachelor\'s Degree'
  //           },
  //           // ... up to 6 drivers
  //       ]);

  // Sending next expected page so it will wait for it to load prior to running next step

  await aviatorDriversPage.clickContinue(() =>
    aviatorVehiclesPage.checkHeading()
  );
  //await aviatorDriversPage.clickContinue();

  await aviatorVehiclesPage.deleteAllVehicles();
  await aviatorVehiclesPage.fillVehicleInfo(testData.vin);
  await aviatorVehiclesPage.clickContinue(() =>
    aviatorPriorPolicyPage.checkHeading()
  );

  await aviatorPriorPolicyPage.fillPriorPolicyInfo(
    testData.priorCarrier,
    testData.yearsWithCarrier,
    testData.liabilityLimits
  );
  await aviatorPriorPolicyPage.clickSubmit(() =>
    aviatorResponsePage.checkHeading()
  );

  await aviatorResponsePage.waitForProgressiveQuote();
});
