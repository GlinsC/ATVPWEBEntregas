// Essa classe simula um banco de dados em memória
// Ou seja, tudo fica salvo em um array enquanto o servidor está rodando

class Database {
  constructor() {
    // Array onde as entregas serão armazenadas
    this.entregas = [];

    // Controle simples de ID (auto incremento)
    this.nextId = 1;
  }

  // Retorna todas as entregas
  getEntregas() {
    return this.entregas;
  }

  // Gera um novo ID único
  generateId() {
    return this.nextId++;
  }
}

module.exports = Database;