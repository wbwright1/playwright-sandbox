import { test, expect } from "./fixtures/pocQTIRootTestData";
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
import { RootVehiclesPage } from "../../pages/Root/RootVehiclesPage";
import { RootCoveragesPage } from "../../pages/Root/RootCoveragesPage";
import { RootPolicySummaryPage } from "../../pages/Root/RootPolicySummaryPage";
import { RootRunReportsModal } from "../../pages/Root/RootRunReportsModal";
import { RootCheckoutPage } from "../../pages/Root/RootCheckoutPage";
import { RootSuccessPage } from "../../pages/Root/RootSuccessPage";

test("Aviator - Single Driver / Single Vehicle", async ({ page, testData }) => {
  test.setTimeout(600000);

  const sfLoginPage = new SFLoginPage(page);
  const aviatorAddressPage = new AviatorAddressPage(page);
  const aviatorClientInfoPage = new AviatorClientInfoPage(page);
  const aviatorDriversPage = new AviatorDriversPage(page);
  const aviatorVehiclesPage = new AviatorVehiclesPage(page);
  const aviatorPriorPolicyPage = new AviatorPriorPolicyPage(page);
  const aviatorResponsePage = new AviatorResponsePage(page);

  let rootBasicInformationPage: RootBasicInformationPage;
  let rootDriversPage: RootDriversPage;
  let rootVehiclesPage: RootVehiclesPage;
  let rootCoveragesPage: RootCoveragesPage;
  let rootPolicySummaryPage: RootPolicySummaryPage;
  let rootRunReportsModal: RootRunReportsModal;
  let rootCheckoutPage: RootCheckoutPage;
  let rootSuccessPage: RootSuccessPage;

  await sfLoginPage.navigateToUATLogin();
  await sfLoginPage.login("automation.testing@goosehead.com.uat", "GHnov2022$");

  await aviatorAddressPage.fillAddressPageWithRetry(testData.address, 2);

  await aviatorClientInfoPage.fillClientInfo(
    testData.drivers[0].firstName,
    testData.drivers[0].lastName,
    testData.drivers[0].dob,
    testData.drivers[0].email,
    testData.drivers[0].phone
  );
  await aviatorClientInfoPage.selectGender(testData.drivers[0].gender);
  await aviatorClientInfoPage.selectMaritalStatus(
    testData.drivers[0].maritalStatus
  );
  await aviatorClientInfoPage.fillPhoneNumber(testData.drivers[0].phone);

  // Sending next expected page so it will wait for it to load prior to running next step
  await aviatorClientInfoPage.clickContinue(() =>
    aviatorDriversPage.checkHeading()
  );

  await aviatorDriversPage.deleteAllDrivers();
  await aviatorDriversPage.fillPrimaryDriverInfo(
    testData.drivers[0].driverLicense,
    testData.drivers[0].dLState,
    testData.drivers[0].education
  );
  await aviatorDriversPage.selectPrimaryOccupation();

  // Sending next expected page so it will wait for it to load prior to running next step
  await aviatorDriversPage.clickContinue(() =>
    aviatorVehiclesPage.checkHeading()
  );
  //await aviatorDriversPage.clickContinue();

  await aviatorVehiclesPage.deleteAllVehicles();
  await aviatorVehiclesPage.fillVehicleInfo(testData.vehicles[0].vin);
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
  rootVehiclesPage = new RootVehiclesPage(newPage);
  rootCoveragesPage = new RootCoveragesPage(newPage);
  rootPolicySummaryPage = new RootPolicySummaryPage(newPage);
  rootRunReportsModal = new RootRunReportsModal(newPage);
  rootCheckoutPage = new RootCheckoutPage(newPage);
  rootSuccessPage = new RootSuccessPage(newPage);

  await rootBasicInformationPage.clickContinue(() =>
    rootDriversPage.checkHeading()
  );

  await rootDriversPage.setDriverExclusionValues("Unknown to Applicant");
  await rootDriversPage.clickContinue(() => rootVehiclesPage.checkHeading());

  // Example: Set all fields to "default-value", except the 3rd one to "custom-value"
  await rootVehiclesPage.setVehicleExclusionValues("Unknown to Applicant");
  await rootVehiclesPage.fillVehicleInfo(testData.vehicles[0]);

  await rootVehiclesPage.clickContinue(() => rootCoveragesPage.checkHeading());
  // await page6.getByLabel('Chase Home Finance, LLC').click();

  await rootCoveragesPage.setRideshare(testData.rideshare);
  // await rootCoveragesPage.setBodilyInjury("$50,000 / $100,000");
  // await rootCoveragesPage.setPropertyDamage("$25,000");
  // await rootCoveragesPage.setUninsuredUnderinsuredBodily("$100,000 / $300,000");
  // await rootCoveragesPage.setUninsuredUnderinsuredPropertyDamage("$50,000");
  // await rootCoveragesPage.setPersonalInjuryProtection("$2,500");
  // await rootCoveragesPage.setMedicalPayments("$500");

  await rootCoveragesPage.clickContinue(() =>
    rootPolicySummaryPage.checkHeading()
  );

  await rootPolicySummaryPage.checkConsumerDisclosure();
  await rootPolicySummaryPage.clickContinueAndRunReports(() =>
    rootRunReportsModal.checkHeading()
  );

  await rootRunReportsModal.clickContinueToCheckout(() =>
    rootCheckoutPage.checkHeading()
  );

  await rootCheckoutPage.selectMonthlyPay();
  await rootCheckoutPage.clickNextStep();

  await rootCheckoutPage.fillCreditCardInformation(testData.paymentDetails);
  await rootCheckoutPage.clickNextStep();
  await rootCheckoutPage.checkDisclaimer();
  await rootCheckoutPage.clickPayNow(() => rootSuccessPage.checkHeading());
});
