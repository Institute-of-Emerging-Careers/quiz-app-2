const { test, expect } = require("@playwright/test");
require("dotenv").config();
const randomstring = require("randomstring");
import { logIntoAdminPanel } from "./utils";

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
  let title = "Course A"

  // Course A
  await page.getByPlaceholder("Course Title").fill(title);
  let addCourseButton = await page.getByRole("button", {
    name: "Add New Course",
  });
  await addCourseButton.click();
  await page.locator(`[data-testid="checkbox-${title}"]`).check();
  let isChecked = await page.locator(`[data-testid="checkbox-${title}"]`).isChecked()
  expect(isChecked).toBeTruthy();

  // Course B
  title = "Course B"
  await page.getByPlaceholder("Course Title").fill(title);
  addCourseButton = await page.getByRole("button", {
    name: "Add New Course",
  });
  await addCourseButton.click();
  await page.locator(`[data-testid="checkbox-${title}"]`).check();
  isChecked = await page.locator(`[data-testid="checkbox-${title}"]`).isChecked()
  expect(isChecked).toBeTruthy();

  // Course C
  title = "Course C"
  await page.getByPlaceholder("Course Title").fill(title);
  addCourseButton = await page.getByRole("button", {
    name: "Add New Course",
  });
  await addCourseButton.click();
  await page.locator(`[data-testid="checkbox-${title}"]`).check();
  isChecked = await page.locator(`[data-testid="checkbox-${title}"]`).isChecked()
  expect(isChecked).toBeTruthy();

  await createRoundButton.click();
  await expect(page.getByText(roundTitle)).toBeVisible();
});
