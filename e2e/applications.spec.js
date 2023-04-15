const { test, expect } = require("@playwright/test");
require("dotenv").config();
const randomstring = require("randomstring");
import { logIntoAdminPanel, createCourseAndCheck, logout } from "./utils/application/utils";

let applicationRoundId = null, roundTitle = `E2E Test Round ${randomstring.generate(8)}`, applicationFormLink = '';

// this tells Playwright to run these tests one after the other, and if one test fails, skip the others
test.describe.configure({ mode: 'serial' });

let page;


test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await logIntoAdminPanel(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Create Application Round", async () => {
  // Create Application Round
  await page.getByRole("link", { name: /Applications/ }).click();
  await expect(page).toHaveTitle("Cohort Applications - Admin Panel");

  await page.getByTestId("new-application-round-button").click();
  const createRoundButton = await page.getByRole("button", {
    name: "Create Application Round",
  });
  await expect(createRoundButton).toBeVisible();
  await page.getByPlaceholder("Cohort 4 Application Round 1").fill(roundTitle);

  // Create three courses and check them
  await createCourseAndCheck("Course A", page)
  await createCourseAndCheck("Course B", page)
  await createCourseAndCheck("Course C", page)

  // Create the Application Round
  await createRoundButton.click();

  // Make sure the round was successfully created
  await expect(page.getByText(roundTitle)).toBeVisible();

  // Copy the url to the application form
  const copyUrlButton = await page.getByTestId(`copy-${roundTitle}-link`)
  applicationRoundId = await copyUrlButton.getAttribute('data-id')
  console.log("applicationRoundId:", applicationRoundId)
  applicationFormLink = `http://localhost:${process.env.PORT}/application/fill/${applicationRoundId}`
});

test("Go to Application Form", async () => {
  await logout(page);

  // Go to application form as logged out student
  await page.goto(applicationFormLink);

  // Select the h1 element by looking for its text content
  await expect(page.getByRole('heading', { name: 'Apply to IEC' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Step 1: Basic Information *' })).toBeVisible();
})