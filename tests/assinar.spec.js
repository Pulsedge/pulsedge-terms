// @ts-check
const { test, expect } = require('@playwright/test');

const WEEKLY_LINK = 'https://asaas.test.invalid/weekly';
const DAILY_LINK = 'https://asaas.test.invalid/daily';

async function mockSubscribe(page, status, body) {
    await page.route('https://api.pulsedge.com.br/subscribe**', route => {
        route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body || {}) });
    });
}

async function mockValidLink(page) {
    await mockSubscribe(page, 200, {
        weekly_plan_price: 297,
        daily_plan_price: 397,
        weekly_plan_link_url: WEEKLY_LINK,
        daily_plan_link_url: DAILY_LINK,
    });
}

test.describe('assinar.html — link valido', () => {
    test('renderiza os 2 planos com o diario pre-selecionado e preco formatado', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        await expect(page.locator('#state-checkout')).toHaveClass(/active/);
        const cards = page.locator('.plan-card');
        await expect(cards).toHaveCount(2);

        const daily = page.locator('.plan-card[data-plan-id="daily"]');
        await expect(daily).toHaveClass(/selected/);
        await expect(daily.locator('.plan-price')).toContainText('R$ 397');

        const weekly = page.locator('.plan-card[data-plan-id="weekly"]');
        await expect(weekly).not.toHaveClass(/selected/);
        await expect(weekly.locator('.plan-price')).toContainText('R$ 297');
    });

    test('botao de assinar so habilita com plano selecionado + checkbox marcado', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        const button = page.locator('#btn-subscribe');
        await expect(button).toBeDisabled();

        await page.locator('#consent-check').check();
        await expect(button).toBeEnabled();

        await page.locator('#consent-check').uncheck();
        await expect(button).toBeDisabled();
    });

    test('trocar de plano atualiza a selecao visual', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        await page.locator('.plan-card[data-plan-id="weekly"]').click();
        await expect(page.locator('.plan-card[data-plan-id="weekly"]')).toHaveClass(/selected/);
        await expect(page.locator('.plan-card[data-plan-id="daily"]')).not.toHaveClass(/selected/);
    });

    test('ao confirmar, redireciona para o link de pagamento do plano selecionado', async ({ page }) => {
        await mockValidLink(page);
        await page.route(DAILY_LINK, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>ok</html>' }));
        await page.goto('/assinar?l=lead123');

        await page.locator('#consent-check').check();
        await page.locator('#btn-subscribe').click();
        await page.waitForURL(DAILY_LINK);
    });

    test('FAQ em acordeao abre e fecha por pergunta', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        const firstItem = page.locator('.faq-item').first();
        await expect(firstItem).not.toHaveAttribute('open', '');

        await firstItem.locator('summary').click();
        await expect(firstItem).toHaveAttribute('open', '');

        await firstItem.locator('summary').click();
        await expect(firstItem).not.toHaveAttribute('open', '');
    });

    test('checkbox de consentimento aponta para termos e privacidade', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        await expect(page.locator('.consent-text a').first()).toHaveAttribute('href', 'https://pulsedge.com.br/termos');
        await expect(page.locator('.consent-text a').nth(1)).toHaveAttribute('href', 'https://pulsedge.com.br/privacidade');
    });
});

test.describe('assinar.html — link invalido/expirado', () => {
    test('422 mostra a tela de link expirado', async ({ page }) => {
        await mockSubscribe(page, 422, {});
        await page.goto('/assinar?l=lead-expirado');

        await expect(page.locator('#state-expired')).toHaveClass(/active/);
        await expect(page.locator('#state-checkout')).not.toHaveClass(/active/);
    });

    test('sem parametro l tambem mostra tela de expirado', async ({ page }) => {
        await page.goto('/assinar');
        await expect(page.locator('#state-expired')).toHaveClass(/active/);
    });
});

test.describe('assinar.html — erro tecnico', () => {
    test('falha 500 da API mostra tela de erro', async ({ page }) => {
        await mockSubscribe(page, 500, {});
        await page.goto('/assinar?l=lead123');

        await expect(page.locator('#state-error')).toHaveClass(/active/);
        await expect(page.locator('#state-checkout')).not.toHaveClass(/active/);
    });
});

test.describe('assinar.html — estrutura geral', () => {
    test('header e solido navy e sem nav institucional', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');

        const bg = await page.locator('header').evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bg).toBe('rgb(26, 43, 74)');
        await expect(page.locator('header nav')).toHaveCount(0);
    });

    test('rodape com ano atual', async ({ page }) => {
        await mockValidLink(page);
        await page.goto('/assinar?l=lead123');
        const year = new Date().getFullYear().toString();
        await expect(page.locator('#footer-year')).toHaveText(year);
    });
});
