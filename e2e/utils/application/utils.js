const { expect } = require("@playwright/test");

export const logIntoAdminPanel = async (page) => {
  await page.goto(`/admin`);
  await expect(page).toHaveTitle("Login - Admin Panel");

  await page.getByLabel("Email Address:").fill("admin@iec.org.pk");
  await page.getByLabel("Password:").fill("examplepassword");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForLoadState('load');
  return expect(page).toHaveTitle("Home - Admin Panel");
};

export const createCourseAndCheck = async (title, page) => {
  await page.getByPlaceholder("Course Title").fill(title);
  let addCourseButton = await page.getByRole("button", {
    name: "Add New Course",
  });
  await addCourseButton.click();
  await page.locator(`[data-testid="checkbox-${title}"]`).check();
  let isChecked = await page.locator(`[data-testid="checkbox-${title}"]`).isChecked()
  return expect(isChecked).toBeTruthy();
}

export const logout = async (page) => {
  const logoutLink = await page.waitForSelector('a[href="/logout"]');
  await logoutLink.click();

  // Wait for second redirect to /admin/login
  return page.waitForURL(`http://localhost:${process.env.PORT}/admin/login`);
}


export const fillStep1 = async (firstName, lastName, email, cnic, page) => {
  await page.getByTestId("firstName-input").fill("Rohan")
  await page.getByTestId("lastName-input").fill("Hussain")
  await page.getByTestId("email-input").fill("rohanhussain1@yahoo.com")
  await page.getByTestId("cnic-input").fill("12345-1234567-8")
  return page.getByTestId("step1-next-button").click()
}