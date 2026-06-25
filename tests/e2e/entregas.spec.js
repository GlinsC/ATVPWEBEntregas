const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { EntregasPage } = require('./pages/EntregasPage');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Entregas E2E', () => {
  let testUser;

  test.beforeEach(async ({ page, baseURL }, testInfo) => {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    testUser = {
      nome: 'Playwright Entregas',
      email: `entregas-${uniqueId}@test.com`,
      senha: '12345678'
    };

    await page.request.post(`${baseURL}/api/auth/registrar`, { data: testUser });

    const loginResponse = await page.request.post(`${baseURL}/api/auth/login`, { data: { email: testUser.email, senha: testUser.senha } });
    const loginBody = await loginResponse.json();

    await page.request.post('/api/entregas', {
      data: {
        descricao: 'Teste Playwright',
        origem: 'Origem A',
        destino: 'Destino B'
      },
      headers: {
        Authorization: `Bearer ${loginBody.token}`
      }
    });
  });

  test('Listagem de entregas mostra ao menos uma linha após login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.senha);

    const entregasPage = new EntregasPage(page);
    await entregasPage.expectTableHasRows();
  });

  test('Logout redireciona para /login e impede acesso a /entregas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.senha);

    const entregasPage = new EntregasPage(page);
    await entregasPage.logout();

    await expect(page).toHaveURL('/login');

    await page.goto('/painel/entregas');
    await expect(page).toHaveURL(/\/login\?error=/);
  });
});