const { test, expect } = require("@playwright/test");
require("dotenv").config();
const randomstring = require("randomstring");
import { logIntoAdminPanel } from "./utils";

const createAndSelectCourse = async (page, title) => {
  await page.getByPlaceholder("Course Title").fill(title);
  const addCourseButton = await page.getByRole("button", {
    name: "Add New Course",
  });
  await addCourseButton.click();
  await page.getByRole("checkbox", { name: title }).check();
  return expect(
    await page.getByRole("checkbox", { name: title }).isChecked()
  ).toBeTruthy();
};

test("Create Application Round", async ({ page }) => {
  await logIntoAdminPanel(page);

  // Create Application Round
  await page.getByRole("link", { name: /Applications/ }).click();
  await expect(page).toHaveTitle("Cohort Applications - Admin Panel");

  await (await page.getByRole("button", { name: "NEW" })).click();
  const createRoundButton = await page.getByRole("button", {
    name: "Create Application Round",
  });
  await expect(createRoundButton).toBeVisible();
  const roundTitle = `E2E Test Round ${randomstring.generate(8)}`;
  await page.getByPlaceholder("Cohort 4 Application Round 1").fill(roundTitle);
  await createAndSelectCourse(page, "Course A");
  await createAndSelectCourse(page, "Course B");
  await createAndSelectCourse(page, "Course C");
  await createRoundButton.click();
  await expect(page.getByText(roundTitle)).toBeVisible();
}, { timeout: 6000 });
