import { test as base } from "@playwright/test";
import { generateRandomString } from "../../shared/utils/randomStringUtils";

type TestData = {
  address: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  driverLicense: string;
  dLState: string;
  education: string;
  vin: string;
  priorCarrier: string;
  yearsWithCarrier: string;
  liabilityLimits: string;
};

export const test = base.extend<{ testData: TestData }>({
  testData: async ({}, use) => {
    const data: TestData = {
      address: "2418 E Mercer LN Phoenix",
      firstName: "James",
      lastName: "Anthony",
      dob: "11/08/1960",
      gender: "Male",
      maritalStatus: "Single",
      phone: "555555555",
      email: `${generateRandomString(10)}@test.com`,
      driverLicense: "B13994920",
      dLState: "AZ",
      education: "Some College",
      vin: "JH4DA9340NS001774",
      priorCarrier: "Allstate",
      yearsWithCarrier: "3",
      liabilityLimits: "100/300",
    };
    await use(data);
  },
});

export { expect } from "@playwright/test";
