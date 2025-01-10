import { test, expect } from "./fixtures/pocQTIRootTestData";
import { Page } from "@playwright/test";
import { SFLoginPage } from "../../pages/SFLoginPage";
import {
  AviatorAddressPage,
  AviatorClientInfoPage,
  AviatorDriversPage,
  AviatorVehiclesPage,
  AviatorPriorPolicyPage,
  AviatorResponsePage,
} from "../../pages/Aviator";
import { RootBasicInformationPage } from "../../pages/Root/RootBasicInformationPage";
import { RootDriversPage } from "../../pages/Root/RootDriversPage";

test("Aviator - Single Driver / Single Vehicle", async ({ page, testData }) => {
  test.setTimeout(60000);

  const sfLoginPage = new SFLoginPage(page);
  const aviatorAddressPage = new AviatorAddressPage(page);
  const aviatorClientInfoPage = new AviatorClientInfoPage(page);
  const aviatorDriversPage = new AviatorDriversPage(page);
  const aviatorVehiclesPage = new AviatorVehiclesPage(page);
  const aviatorPriorPolicyPage = new AviatorPriorPolicyPage(page);
  const aviatorResponsePage = new AviatorResponsePage(page);

  let rootBasicInformationPage: RootBasicInformationPage;
  let rootDriversPage: RootDriversPage;

  await sfLoginPage.navigateToLogin();
  await sfLoginPage.login("automation.testing@goosehead.com.uat", "GHnov2022$");

  await aviatorAddressPage.fillAddressPageWithRetry(testData.address, 2);

  await aviatorClientInfoPage.fillClientInfo(
    testData.firstName,
    testData.lastName,
    testData.dob,
    testData.email
  );
  await aviatorClientInfoPage.selectGender(testData.gender);
  await aviatorClientInfoPage.selectMaritalStatus(testData.maritalStatus);
  await aviatorClientInfoPage.fillPhoneNumber(testData.phone);

  // Sending next expected page so it will wait for it to load prior to running next step
  await aviatorClientInfoPage.clickContinue(() =>
    aviatorDriversPage.checkHeading()
  );

  await aviatorDriversPage.deleteAllDrivers();
  await aviatorDriversPage.fillPrimaryDriverInfo(
    testData.driverLicense,
    testData.dLState,
    testData.education
  );
  await aviatorDriversPage.selectPrimaryOccupation();

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

  await aviatorResponsePage.waitForRootQuote();
  const newPage = await aviatorResponsePage.openRootQTI();

  // Initialize page objects with the new page
  rootBasicInformationPage = new RootBasicInformationPage(newPage);
  rootDriversPage = new RootDriversPage(newPage);

  await rootBasicInformationPage.clickContinue(() =>
    rootDriversPage.checkHeading()
  );

  //await rootDriversPage.clickContinue();
});
