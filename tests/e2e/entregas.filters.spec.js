const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { EntregasPage } = require('./pages/EntregasPage');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';

test.describe('Entregas E2E - filtros e paginação', () => {
  let testUser;

  test.beforeEach(async ({ page, request }) => {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    testUser = {
      nome: 'Playwright Entregas Filtros',
      email: `entregas-filtros-${uniqueId}@test.com`,
      senha: '12345678'
    };

    const apiContext = request;
    await apiContext.post(`${BASE_URL}/api/auth/registrar`, { data: testUser });
    const loginResponse = await apiContext.post(`${BASE_URL}/api/auth/login`, {
      data: { email: testUser.email, senha: testUser.senha }
    });
    const loginBody = await loginResponse.json();

    const entregasPayload = [
      { descricao: 'Entrega A', origem: 'Cidade A', destino: 'Cidade B' },
      { descricao: 'Entrega B', origem: 'Cidade C', destino: 'Cidade D' },
      { descricao: 'Entrega C', origem: 'Cidade E', destino: 'Cidade F' }
    ];

    const createdEntregas = [];
    for (const payload of entregasPayload) {
      const response = await apiContext.post(`${BASE_URL}/api/entregas`, {
        data: payload,
        headers: { Authorization: `Bearer ${loginBody.token}` }
      });
      const entrega = await response.json();
      createdEntregas.push(entrega);
    }

    await apiContext.patch(`${BASE_URL}/api/entregas/${createdEntregas[0].id}/avancar`, {
      headers: { Authorization: `Bearer ${loginBody.token}` }
    });
    await apiContext.patch(`${BASE_URL}/api/entregas/${createdEntregas[0].id}/avancar`, {
      headers: { Authorization: `Bearer ${loginBody.token}` }
    });
    await apiContext.patch(`${BASE_URL}/api/entregas/${createdEntregas[1].id}/avancar`, {
      headers: { Authorization: `Bearer ${loginBody.token}` }
    });
    await apiContext.dispose();
  });

  test('filtro por status exibe apenas entregas correspondentes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.senha);
    await expect(page).toHaveURL(/\/painel\/entregas/);

    const entregasPage = new EntregasPage(page);
    await entregasPage.filterByStatus('EM_TRANSITO');

    const statuses = await entregasPage.getRowStatuses();
    expect(statuses.length).toBeGreaterThan(0);
    statuses.forEach(status => expect(status).toBe('EM_TRANSITO'));
    expect(page.url()).toContain('status=EM_TRANSITO');
  });

  test('paginação funciona com página 1 e página 2', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.senha);
    await expect(page).toHaveURL(/\/painel\/entregas/);

    const entregasPage = new EntregasPage(page);
    await entregasPage.gotoPage(1);
    await expect(entregasPage.table).toBeVisible();
    const firstPageCount = await entregasPage.getRowCount();
    expect(firstPageCount).toBeGreaterThan(0);
    expect(page.url()).toContain('page=1');

    await entregasPage.gotoPage(2);
    await expect(entregasPage.table).toBeVisible();
    expect(page.url()).toContain('page=2');
  });
});