import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:4200`);
});

test.describe("Form Layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  // #33
  test(`input field`, async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator(`nb-card`, { hasText: `Using the Grid` })
      .getByRole("textbox", { name: "Email" });

    await usingTheGridEmailInput.fill(`uma@musume`);
    await usingTheGridEmailInput.clear(); // Clear the input field
    await usingTheGridEmailInput.pressSequentially(`uma2@musume`, {
      delay: 500,
    }); // Delay between each key press by 500ms

    // Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual(`uma2@musume`);

    // Locator assertion
    await expect(usingTheGridEmailInput).toHaveValue(`uma2@musume`);
  });

  // #34
  test(`radio button`, async ({ page }) => {
    const usingGridForm = page.locator(`nb-card`, {
      hasText: `Using the Grid`,
    });

    await usingGridForm.getByLabel(`Option 1`).check({ force: true }); // Force check the radio button because it has visually-hidden

    // Another way to do this
    await usingGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });

    // Generic assertion
    const radioStatus = await usingGridForm.getByLabel(`Option 1`).isChecked();
    expect(radioStatus).toBeTruthy();
    // OR
    await expect(usingGridForm.getByLabel(`Option 1`)).toBeChecked();

    // Now click radio button 2
    await usingGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(await usingGridForm.getByLabel(`Option 1`).isChecked()).toBeFalsy();
    expect(await usingGridForm.getByLabel(`Option 2`).isChecked()).toBeTruthy();
  });
});

// #35
test(`Checkbox`, async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .click({ force: true }); // Use click, not check. Check will ensure it's checked, click doesn't care if its already checked or not, its just a click action
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });
  await page
    .getByRole("checkbox", { name: "Show toast with icon" })
    .uncheck({ force: true });

  // Check/Uncheck all checkboxes
  const allCheckboxes = page.getByRole("checkbox");
  for (const checkbox of await allCheckboxes.all()) {
    await checkbox.check({ force: true });
    expect(await checkbox.isChecked()).toBeTruthy();
  }
});

// #36
test(`List and Dropdown`, async ({ page }) => {
  const dropDownMenu = page.locator(`ngx-header nb-select`);
  await dropDownMenu.click();

  page.getByRole(`list`); // can be used when the list has an UL tag
  page.getByRole(`listitem`); // can be used when the list has an LI tag

  // const optionList = page.getByRole(`list`).locator(`nb-option`); // First approach

  const optionList = page.locator(`nb-option-list nb-option`); // Second approach, cleaner
  await expect(optionList).toHaveText([`Light`, `Dark`, `Cosmic`, `Corporate`]);

  // Pick Cosmic option
  await optionList.getByText(`Cosmic`).click();
  const header = page.locator(`nb-layout-header`);
  await expect(header).toHaveCSS(`background-color`, `rgb(50, 50, 89)`); // Cosmic theme background color, click on the nb-layout-header in the HTML --> nb-layout-header on the Style panel

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  for (const color in colors) {
    await dropDownMenu.click();
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS(`background-color`, colors[color]);
  }
});

// #37
test(`Tooltip`, async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator(`nb-card`, {
    hasText: `Tooltip Placements`,
  });
  await toolTipCard.getByRole(`button`, { name: `Top` }).hover();

  // page.getByRole(`tooltip`); // only works if you have a role tooltip created
  // If it's not available
  const tooltip = await page.locator(`nb-tooltip`).textContent();
  expect(tooltip).toEqual(`This is a tooltip`);
});

// #38
test(`Dialog`, async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  page.on(`dialog`, (dialog) => {
    expect(dialog.message()).toEqual(`Are you sure you want to delete?`);
    dialog.accept(); // Accept the dialog to close it
  });

  await page
    .getByRole(`table`)
    .locator(`tr`, { hasText: `mdo@gmail.com` })
    .locator(`.nb-trash`)
    .click();

  await expect(page.locator(`table tr`).first()).not.toHaveText(
    `mdo@gmail.com`
  );
});

// #39
test(`Table`, async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1. Get the row by any text of this row
  const targetRow = page.getByRole(`row`, { name: `mdo@gmail.com` });
  await targetRow.locator(`.nb-edit`).click(); // Note: name only works with HTML text, not with properties
  // await page.locator(`input-editor`).getByPlaceholder(`Age`).clear();
  await page.locator(`input-editor`).getByPlaceholder(`Age`).fill(`1997`);
  await page.locator(`.nb-checkmark`).click();

  // 2. Get the row based on ID
  await page.locator(`.ng2-smart-pagination-nav`).getByText(`2`).click();
  const targetRowID = page
    .getByRole(`row`, { name: `11` })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  // Explain: There are 2 rows with text "11" using this `getByRole(`row`, { name: `11` }).`; which are age and ID, so using filter, the second `.getByText('11')` is used to check the ID of the 2nd column defined by nth(1) in the table
  await targetRowID.locator(`.nb-edit`).click();
  await page
    .locator(`input-editor`)
    .getByPlaceholder(`E-mail`)
    .fill(`uma@musume`);
  await page.locator(`.nb-checkmark`).click();

  await expect(targetRowID.locator(`td`).nth(5)).toHaveText("uma@musume");
});

// #40
// 3. Test filter by table
test(`Table Filter`, async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  const ages = [`20`, `30`, `40`, `200`];

  for (let age of ages) {
    await page.locator(`input-filter`).getByPlaceholder(`Age`).fill(age);
    await page.waitForTimeout(500); // Wait for the filter to apply

    const ageRows = page.locator(`tbody tr`); // Get all row of result output
    for (let row of await ageRows.all()) {
      const ageText = await row.locator(`td`).last().textContent(); // Get the text of the last cell in each row
      if (age === `200`) {
        expect(await page.getByRole(`table`).textContent()).toContain(
          `No data found`
        ); // If age is 200, expect no rows
      } else {
        expect(ageText).toContain(age);
      }
    }
  }
});

// #41+42
test(`Datepicker`, async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calenderInputField = page.getByPlaceholder("Form Picker");
  await calenderInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 140); // Select x days from today
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMonthYearHeader = await page
    .locator(`nb-calendar-view-mode`)
    .textContent();
  const expectedMonthYearHeader = `${expectedMonthLong} ${expectedYear}`;
  while (calendarMonthYearHeader.includes(expectedMonthYearHeader) === false) {
    await page
      .locator(`nb-calendar-pageable-navigation [data-name="chevron-right"]`)
      .click();
    calendarMonthYearHeader = await page
      .locator(`nb-calendar-view-mode`)
      .textContent();
  } // Deal with when the month is not the current month

  // Manually set date
  // await page
  //   .locator('[class="day-cell ng-star-inserted"]')
  //   .getByText("1", { exact: true })
  //   .click(); // Click on the 1st day of the month

  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click(); // Click on the 1st day of the month
  await expect(calenderInputField).toHaveValue(dateToAssert);
});

// #43
// test(`Sliders`, async ({ page }) => {});
