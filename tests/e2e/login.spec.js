const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Login E2E', () => {
  test('Login inválido exibe mensagem de erro e não redireciona', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('naoexistente@teste.com', 'senhaerrada');
    await expect(page).toHaveURL(/\/login\?error=/);
    await loginPage.expectError('Credenciais inválidas');
  });

  test('Login válido redireciona para /entregas', async ({ page, request }) => {
    const user = {
      nome: 'Playwright Usuário',
      email: `playwright-${Date.now()}@test.com`,
      senha: '12345678'
    };

    await request.post(`${BASE_URL}/api/auth/registrar`, { data: user });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.email, user.senha);

    await expect(page).toHaveURL(/\/painel\/entregas$/);
    await expect(page.locator('[data-testid="tabela-entregas"]')).toBeVisible();
  });

  test('Acesso sem autenticação redireciona para /login', async ({ page }) => {
    await page.goto('/entregas');
    await expect(page).toHaveURL(/\/login\?error=/);
    await expect(page.locator('[data-testid="alerta-erro"]')).toBeVisible();
  });
});