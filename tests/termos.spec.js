// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('termos.html', () => {
    test('header e solido navy desde o carregamento, mesmo sem rolar', async ({ page }) => {
        await page.goto('/termos');
        const bg = await page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bg).toBe('rgb(26, 43, 74)');
    });

    test('nav do header aponta para Inicio e Privacidade', async ({ page }) => {
        await page.goto('/termos');
        await expect(page.locator('.header-nav a[href="/home"]')).toHaveText('Início');
        await expect(page.locator('.header-nav a[href="/privacidade"]')).toHaveText('Política de Privacidade');
    });

    test('titulo da pagina e o rodape estao corretos', async ({ page }) => {
        await page.goto('/termos');
        await expect(page.locator('h1')).toHaveText('Termos de Serviço');
        const year = new Date().getFullYear().toString();
        await expect(page.locator('#footer-year')).toHaveText(year);
    });
});

test.describe('termos.html — menu hamburguer no mobile', () => {
    test.use({ viewport: { width: 375, height: 700 } });

    test('nav fica oculta e hamburguer visivel; clique abre e mostra Inicio e Privacidade', async ({ page }) => {
        await page.goto('/termos');

        const nav = page.locator('#header-nav');
        const toggle = page.locator('#menu-toggle');

        await expect(nav).toBeHidden();
        await expect(toggle).toBeVisible();

        await toggle.click();

        await expect(nav).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(nav.getByText('Início')).toBeVisible();
        await expect(nav.getByText('Política de Privacidade')).toBeVisible();
    });
});
