import { test, expect } from '@playwright/test';
import { using } from 'rxjs';
import { delay } from 'rxjs/internal/operators/delay';

test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:4200`);
});

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    // #33
    test(`input field`, async ({ page }) => { 
        const usingTheGridEmailInput = page.locator(`nb-card`, { hasText: `Using the Grid` }).getByRole('textbox', { name: 'Email' });
        
        await usingTheGridEmailInput.fill(`uma@musume`);
        await usingTheGridEmailInput.clear(); // Clear the input field
        await usingTheGridEmailInput.pressSequentially(`uma2@musume`, { delay: 500 }); // Delay between each key press by 500ms
        
        // Generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual(`uma2@musume`);

        // Locator assertion
        await expect(usingTheGridEmailInput).toHaveValue(`uma2@musume`);
    });

    // #34
    test(`radio button`, async ({ page }) => {
        const usingGridForm = page.locator(`nb-card`, { hasText: `Using the Grid` });

        await usingGridForm.getByLabel(`Option 1`).check({ force: true }); // Force check the radio button because it has visually-hidden
        
        // Another way to do this
        await usingGridForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });

        // Generic assertion
        const radioStatus = await usingGridForm.getByLabel(`Option 1`).isChecked();
        expect(radioStatus).toBeTruthy();
        // OR
        await expect(usingGridForm.getByLabel(`Option 1`)).toBeChecked();

        // Now click radio button 2
        await usingGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        expect(await usingGridForm.getByLabel(`Option 1`).isChecked()).toBeFalsy();
        expect(await usingGridForm.getByLabel(`Option 2`).isChecked()).toBeTruthy();

    });
});

// #35
test(`checkbox`, async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true }); // Use click, not check. Check will ensure it's checked, click doesn't care if its already checked or not, its just a click action
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });
    await page.getByRole('checkbox', { name: 'Show toast with icon' }).uncheck({ force: true });
    
    // Check/Uncheck all checkboxes
    const allCheckboxes = page.getByRole('checkbox');
    for (const checkbox of await allCheckboxes.all()) {
        await checkbox.check({ force: true });
        expect(await checkbox.isChecked()).toBeTruthy();
    }
});