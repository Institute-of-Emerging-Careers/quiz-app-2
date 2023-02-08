const { test, expect } = require("@playwright/test");
require("dotenv").config();

export const logIntoAdminPanel = async (page) => {
  await page.goto(`http://localhost:${process.env.PORT}/admin`);
  await expect(page).toHaveTitle("Login - Admin Panel");

  await page.getByLabel("Email Address:").fill("admin@iec.org.pk");
  await page.getByLabel("Password:").fill("examplepassword");
  await page.getByRole("button", { name: "Log In" }).click();
  return expect(page).toHaveTitle("Home - Admin Panel");
};
