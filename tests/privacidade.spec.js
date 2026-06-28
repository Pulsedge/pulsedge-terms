// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('privacidade.html', () => {
    test('header e solido navy desde o carregamento, mesmo sem rolar', async ({ page }) => {
        await page.goto('/privacidade');
        const bg = await page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bg).toBe('rgb(26, 43, 74)');
    });

    test('nav do header aponta para Inicio e Termos', async ({ page }) => {
        await page.goto('/privacidade');
        await expect(page.locator('.header-nav a[href="/home"]')).toHaveText('Início');
        await expect(page.locator('.header-nav a[href="/termos"]')).toHaveText('Termos de Serviço');
    });

    test('titulo da pagina e o rodape estao corretos', async ({ page }) => {
        await page.goto('/privacidade');
        await expect(page.locator('h1')).toHaveText('Política de Privacidade');
        const year = new Date().getFullYear().toString();
        await expect(page.locator('#footer-year')).toHaveText(year);
    });
});
