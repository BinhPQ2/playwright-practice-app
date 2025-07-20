import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:4200/`);
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('Locator syntax rules', async ({ page }) => {
    //by Tag name
    await page.locator('input').first().click();
    
    //by ID
    page.locator('#inputEmail1');
    
    //by Class value
    page.locator('.shape-rectangle');
    
    //by attribute
    page.locator('[placeholder="Email"]');
    
    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');
    
    //combine different selectors
    page.locator('input [placeholder="Email"] [nbinput]');
    
    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');

    // by partial text match
    page.locator(':text("Using")');
    //by exact text match
    page.locator(':text-is("Using the Grid")');
});

test(`User facing locators`, async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.getByRole('button', { name: 'Sign in' }).first().click();
    await page.getByLabel('Email').first().click();
    await page.getByTestId('SignIn').click();
    await page.getByPlaceholder('Jane Doe').first().click();
    await page.getByText('Using the Grid').first().click();
    await page.getByTitle('IoT Dashboard').first().click();
});

test(`Locating child elements`, async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click(); // These 2 lines are equivalent

    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

    await page.locator('nb-card').nth(3).getByRole('button').click(); // Count from index 0, so this is the 4th card
});

test(`Locating parents`, async ({ page }) => {
    await page.locator(`nb-card`, { hasText: `Using the grid` }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator(`nb-card`, { has: page.locator(`#inputEmail1`) }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator(`nb-card`).filter({ hasText: `Basic form` }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator(`nb-card`).filter({ has: page.locator(`.status-danger`) }).getByRole('textbox', { name: 'Password' }).click();

    await page.locator(`nb-card`).filter({ has: page.locator(`nb-checkbox`) }).filter({ hasText: `Sign In` }).getByRole('button', { name: 'Sign in' }).click();

    // Go back 1 level
    await page.locator(`:text-is("Using the Grid")`).locator('..').getByRole('textbox', { name: 'Email' }).click();
});


// #28
test(`Reusing locators`, async ({ page }) => {
    const basicForm = page.locator(`nb-card`, { hasText: `Basic form` });
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    const passwordField = basicForm.getByRole('textbox', { name: 'Password' });
    const submitButton = basicForm.getByRole('button', { name: 'Submit' });
    const testEmail = `Uma@musume.com`;

    await emailField.fill(testEmail);
    await passwordField.fill(`Maruzensky`);
    await basicForm.locator(`nb-checkbox`).click();
    await submitButton.click();

    await expect(emailField).toHaveValue(testEmail);
});

// #29
test(`Extracting value`, async ({ page }) => {
    
    // Get Submit button text
    const basicForm = page.locator(`nb-card`, { hasText: `Basic form` });
    const buttonText = await basicForm.getByRole('button').textContent();  // needs to use await because this returns a Promise

    expect(buttonText).toBe(`Submit`);

    // Get all buttons text
    const allRadioButtons = await page.locator(`nb-radio`).allTextContents();
    expect(allRadioButtons).toContain(`Option 1`);

    // Get input values
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    await emailField.fill(`Uma@musume.com`);
    const inputValue = await emailField.inputValue();
    expect(inputValue).toBe(`Uma@musume.com`);

    // Get placeholder value
    const placeHolderValue = await emailField.getAttribute('placeholder');
    expect(placeHolderValue).toBe(`Email`);
});


// #30
test(`Assertion`, async({ page }) => {
    const basicFormButton = page.locator(`nb-card`, { hasText: `Basic form` }).locator(`button`);

    // General assertion
    const buttonText = await basicFormButton.textContent();
    expect(buttonText).toBe(`Submit`);

    // Locator assertion
    await expect(basicFormButton).toHaveText(`Submit`);

    // Soft assertion
    await expect.soft(basicFormButton).toHaveText(`Submit123`); // This will fail but will not stop the test execution
    await basicFormButton.click();
});