import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";

test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:4200`);
});

test("Navigation to Form page", async ({ page }) => {
  const navigationTo = new NavigationPage(page);
  await navigationTo.formLayoutPage();
});
