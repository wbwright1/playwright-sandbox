import { test as base } from "@playwright/test";
import { generateRandomString } from "../../utils/randomStringUtils";

type Driver = {
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
};

type Vehicle = {
  vin: string;
  make: string;
  model: string;
  year: number;
  assignedDriver: string; // This will map to a driver's name, e.g., "Richard King"
  ownershipType: string;
};

type PaymentDetails = {
  cardHolderName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddress: string;
  zipCode: string;
};

type TestData = {
  address: string;
  priorCarrier: string;
  yearsWithCarrier: string;
  liabilityLimits: string;
  drivers: Driver[];
  vehicles: Vehicle[];
  paymentDetails: PaymentDetails;
  rideshare: string;
};

export const test = base.extend<{ testData: TestData }>({
  testData: async ({}, use) => {
    const data: TestData = {
      address: "8607 Concerto Cir",
      priorCarrier: "Allstate",
      yearsWithCarrier: "3",
      liabilityLimits: "100/300",
      rideshare: "No",
      drivers: [
        {
          firstName: "Richard",
          lastName: "King",
          dob: "01/01/1944",
          gender: "Male",
          maritalStatus: "Single",
          phone: "5555555555",
          email: `${generateRandomString(10)}@test.com`,
          driverLicense: "00000004",
          dLState: "TX",
          education: "Some College",
        },
        {
          firstName: "Sarah",
          lastName: "Smith",
          dob: "03/22/1980",
          gender: "Female",
          maritalStatus: "Married",
          phone: "5555555556",
          email: `${generateRandomString(10)}@test.com`,
          driverLicense: "00000005",
          dLState: "CA",
          education: "Bachelor's Degree",
        },
      ],
      vehicles: [
        {
          vin: "JH4DA9340NS001774",
          make: "Honda",
          model: "Civic",
          year: 2020,
          assignedDriver: "Richard King", // Maps to driver 1
          ownershipType: "Own",
        },
        {
          vin: "1HGCM82633A123456",
          make: "Toyota",
          model: "Corolla",
          year: 2019,
          assignedDriver: "Sarah Smith", // Maps to driver 2
          ownershipType: "Own",
        },
      ],
      paymentDetails: {
        cardHolderName: "Richard King",
        cardNumber: "4111111111111111", // Example Visa test card number
        expirationDate: "03/30",
        cvv: "737",
        billingAddress: "8607 Concerto Cir",
        zipCode: "75034",
      },
    };

    await use(data);
  },
});

export { expect } from "@playwright/test";
