const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="input-email"]');
    this.passwordInput = page.locator('[data-testid="input-senha"]');
    this.loginButton = page.locator('[data-testid="btn-login"]');
    this.errorAlert = page.locator('[data-testid="alerta-erro"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, senha) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(senha);
    await Promise.all([
      this.page.waitForNavigation(),
      this.loginButton.click()
    ]);
  }

  async expectError(message) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(message);
  }
}

module.exports = { LoginPage };