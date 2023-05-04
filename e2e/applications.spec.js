const { test, expect } = require("@playwright/test");
require("dotenv").config();
const randomstring = require("randomstring");
import { logIntoAdminPanel, createCourseAndCheck, logout, fillStep1 } from "./utils/application/utils";

let applicationRoundId = null, roundTitle = `E2E Test Round ${randomstring.generate(8)}`, applicationFormLink = '';

// // this tells Playwright to run these tests one after the other, and if one test fails, skip the others
// test.describe.configure({ mode: 'serial' });

// let page;


// test.beforeAll(async ({ browser }) => {
//   page = await browser.newPage();
//   await logIntoAdminPanel(page);
// });

// test.afterAll(async () => {
//   await page.close();
// });

// test("Create Application Round", async () => {
//   // Create Application Round
//   await page.getByRole("link", { name: /Applications/ }).click();
//   await expect(page).toHaveTitle("Cohort Applications - Admin Panel");

//   await page.getByTestId("new-application-round-button").click();
//   const createRoundButton = await page.getByRole("button", {
//     name: "Create Application Round",
//   });
//   await expect(createRoundButton).toBeVisible();
//   await page.getByPlaceholder("Cohort 4 Application Round 1").fill(roundTitle);

//   // Create three courses and check them
//   await createCourseAndCheck("Course A", page)
//   await createCourseAndCheck("Course B", page)
//   await createCourseAndCheck("Course C", page)

//   // Create the Application Round
//   await createRoundButton.click();

//   // Make sure the round was successfully created
//   await expect(page.getByText(roundTitle)).toBeVisible();

//   // Copy the url to the application form
//   const copyUrlButton = await page.getByTestId(`copy-${roundTitle}-link`)
//   applicationRoundId = await copyUrlButton.getAttribute('data-id')
//   console.log("applicationRoundId:", applicationRoundId)
//   applicationFormLink = `http://localhost:${process.env.PORT}/application/fill/${applicationRoundId}`
// });

// test("Application Form opens", async () => {
//   await logout(page);

//   // Go to application form as logged out student
//   await page.goto(applicationFormLink);

//   // Select the h1 element by looking for its text content
//   await expect(page.getByRole('heading', { name: 'Apply to IEC' })).toBeVisible();
//   await expect(page.getByRole('heading', { name: 'Step 1: Basic Information *' })).toBeVisible();
// })

// test("Filling step 1 with an existing account but wrong cnic number should show error message", async () => {
//   // Filling correct email but wrong cnic number
//   await fillStep1("Rohan", "Hussain", "rohanhussain1@yahoo.com", "12345-1234567-8", page)
//   expect(await page.getByText(/The email above already exists in our database. It means you have already applied before. But you entered a different CNIC number last time./)).toBeTruthy()
//   await expect(page.getByText("Step 2: Personal Information")).not.toBeVisible()
// })

// test("Filling step 1 with an existing account but wrong email address should show error message", async () => {
//   // Filling correct cnic number but wrong email address
//   await fillStep1("Rohan", "Hussain", "wrong@yahoo.com", "00000-0000000-0", page)
//   expect(await page.getByText(/We already have this CNIC in our database. It means you have applied to IEC in the past, but you used a different email address the last time./)).toBeTruthy()
//   await expect(page.getByText("Step 2: Personal Information")).not.toBeVisible()
// })

// test("Filling step 1 with an existing account correctly should show Step 2", async () => {
//   // Filling correct cnic number but wrong email address
//   await fillStep1("Rohan", "Hussain", "rohanhussain1@yahoo.com", "00000-0000000-0", page)
//   await expect(page.getByText("Step 2: Personal Information")).toBeVisible()
// })