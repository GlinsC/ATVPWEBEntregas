const sqlite3 = require("sqlite3").verbose();

// Cria ou conecta ao banco
const db = new sqlite3.Database("./database.sqlite");

// Criar tabelas automaticamente
db.serialize(() => {
  // Tabela de motoristas
  db.run(`
    CREATE TABLE IF NOT EXISTS motoristas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      placaVeiculo TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);

  // Tabela de entregas
  db.run(`
    CREATE TABLE IF NOT EXISTS entregas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      origem TEXT NOT NULL,
      destino TEXT NOT NULL,
      status TEXT NOT NULL,
      motoristaId INTEGER,
      FOREIGN KEY (motoristaId) REFERENCES motoristas(id)
    )
  `);
});

module.exports = db;