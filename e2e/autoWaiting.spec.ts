import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(`http://uitestingplayground.com/ajax`);
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout + 2000); // Increase timeout for every tests in this suite by 2 seconds
});

// #31
test(`Auto waiting`, async ({ page }) => {
    const successButton = page.locator(`.bg-success`).first();

    // await successButton.click()

    // const successText = await successButton.textContent();
    // expect(successText).toEqual('Data loaded with AJAX get request');

    await successButton.waitFor({ state: 'attached' });
    const allSuccessText = await successButton.allTextContents();

    expect(allSuccessText).toContain('Data loaded with AJAX get request.');
})

test(`Auto waiting override timeout`, async ({ page }) => {
    const successButton = page.locator(`.bg-success`).first();
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}); // Override default timeout for this assertion
});

test(`Alternative waiting`, async ({ page }) => { 
    const successButton = page.locator(`.bg-success`).first();

    // waiting for element
    // await page.waitForSelector(`.bg-success`);

    // Waiting for particular response
    await page.waitForResponse(`http://uitestingplayground.com/ajaxdata`);

    // Wait for network calls to be completed (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle'); // Sometimes it will stuck here and not all API is important

    // Wait for timeout
    // await page.waitForTimeout(5000);

    // Wait for URL
    // await page.waitForURL(`http://uitestingplayground.com/ajax`);

    const allSuccessText = await successButton.allTextContents();
    expect(allSuccessText).toContain('Data loaded with AJAX get request.');
});

// #32
test(`Timeouts`, async ({ page }) => {
    // test.setTimeout(20000); // Manually set 20 seconds for this test
    test.slow(); // Increase timeout by 3x times for this particular test
    const successButton = page.locator(`.bg-success`).first();
    await successButton.click({timeout: 16000}); // Will be affected by action timeout
});