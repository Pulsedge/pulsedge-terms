// @ts-check
const { test, expect } = require('@playwright/test');

function alphaOf(rgbaString) {
    const match = rgbaString.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(',').map(s => s.trim());
    return parts.length === 4 ? parseFloat(parts[3]) : 1;
}

async function mockStats(page, { companies = 1234, cities = 7, fail = false } = {}) {
    await page.route('https://api.pulsedge.com.br/stats', route => {
        if (fail) return route.fulfill({ status: 500, body: '{}' });
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ companies, cities }) });
    });
}

test.describe('home.html — header dinâmico no scroll', () => {
    test('comeca transparente e fica solido navy apos passar o hero', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');

        const header = page.locator('header');
        const initialBg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(alphaOf(initialBg)).toBeLessThan(0.05);

        await page.evaluate(() => {
            const wrap = document.querySelector('.hero-wrap');
            window.scrollTo(0, wrap.offsetHeight);
        });
        await page.waitForTimeout(100);

        const scrolledBg = await header.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(alphaOf(scrolledBg)).toBeGreaterThan(0.95);
        expect(scrolledBg).toContain('26, 43, 74');
    });

    test('opacidade e intermediaria na metade do hero', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');

        await page.evaluate(() => {
            const wrap = document.querySelector('.hero-wrap');
            const header = document.querySelector('header');
            window.scrollTo(0, (wrap.offsetHeight - header.offsetHeight) / 2);
        });
        await page.waitForTimeout(100);

        const bg = await page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor);
        const alpha = alphaOf(bg);
        expect(alpha).toBeGreaterThan(0.05);
        expect(alpha).toBeLessThan(0.95);
    });
});

test.describe('home.html — contadores de estatisticas', () => {
    test('anima do mock ate o valor real, formatado em pt-BR, com a cauda lenta', async ({ page }) => {
        await mockStats(page, { companies: 1234, cities: 7 });
        await page.goto('/home');

        await expect(page.locator('#stat-companies')).toHaveText('1.234+', { timeout: 5000 });
        await expect(page.locator('#stat-cities')).toHaveText('7+', { timeout: 5000 });
    });

    test('mostra placeholder em caso de falha da API', async ({ page }) => {
        await mockStats(page, { fail: true });
        await page.goto('/home');

        await expect(page.locator('#stat-companies')).toHaveText('—', { timeout: 5000 });
        await expect(page.locator('#stat-cities')).toHaveText('—', { timeout: 5000 });
    });
});

test.describe('home.html — modal da foto do fundador', () => {
    test('abre ao clicar no avatar e fecha ao clicar na modal', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');

        const modal = page.locator('#avatar-modal');
        await expect(modal).not.toHaveClass(/open/);

        await page.locator('#founder-avatar').click();
        await expect(modal).toHaveClass(/open/);

        await modal.click();
        await expect(modal).not.toHaveClass(/open/);
    });
});

test.describe('home.html — mapa de cobertura (SP)', () => {
    test('renderiza o outline com path valido e os pins', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');

        const path = page.locator('.map-card svg path');
        await expect(path).toHaveCount(1);
        const d = await path.getAttribute('d');
        expect(d.length).toBeGreaterThan(100);
        expect(d.trim().startsWith('M')).toBeTruthy();

        await expect(page.locator('.map-card svg .map-pin')).toHaveCount(6);
    });
});

test.describe('home.html — rodape e segmentos', () => {
    test('ano do rodape e o ano atual', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');
        const year = new Date().getFullYear().toString();
        await expect(page.locator('#footer-year')).toHaveText(year);
    });

    test('lista os 8 segmentos de publico', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');
        await expect(page.locator('.segment-chip')).toHaveCount(8);
    });
});

test.describe('home.html — menu hamburguer no mobile', () => {
    test.use({ viewport: { width: 375, height: 700 } });

    test('nav fica oculta e hamburguer visivel; clique abre e mostra os links institucionais', async ({ page }) => {
        await mockStats(page);
        await page.goto('/home');

        const nav = page.locator('#header-nav');
        const toggle = page.locator('#menu-toggle');

        await expect(nav).toBeHidden();
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');

        await toggle.click();

        await expect(nav).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(nav.getByText('Termos de Serviço')).toBeVisible();
        await expect(nav.getByText('Política de Privacidade')).toBeVisible();

        await toggle.click();
        await expect(nav).toBeHidden();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('em viewport desktop a nav fica visivel e o hamburguer oculto', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await mockStats(page);
        await page.goto('/home');

        await expect(page.locator('#header-nav')).toBeVisible();
        await expect(page.locator('#menu-toggle')).toBeHidden();
    });
});
