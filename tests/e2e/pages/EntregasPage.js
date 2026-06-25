const { expect } = require('@playwright/test');

class EntregasPage {
  constructor(page) {
    this.page = page;
    this.table = page.locator('[data-testid="tabela-entregas"]');
    this.rows = this.table.locator('tbody tr');
    this.logoutButton = page.locator('[data-testid="btn-logout"]');
    this.errorAlert = page.locator('[data-testid="alerta-erro"]');
    this.statusSelect = page.locator('select[name="status"]');
    this.filterButton = page.locator('button', { hasText: 'Filtrar' });
  }

  async goto() {
    await this.page.goto('/painel/entregas');
  }

  async gotoPage(pageNumber) {
    await this.page.goto(`/painel/entregas?page=${pageNumber}`);
  }

  async filterByStatus(status) {
    await this.statusSelect.selectOption(status);
    await this.filterButton.click();
  }

  async expectTableHasRows() {
    await expect(this.table).toBeVisible();
    const count = await this.rows.count();
    expect(count).toBeGreaterThan(0);
  }

  async getRowCount() {
    return await this.rows.count();
  }

  async getRowStatuses() {
    return await this.rows.locator('td:nth-child(5)').allTextContents();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { EntregasPage };