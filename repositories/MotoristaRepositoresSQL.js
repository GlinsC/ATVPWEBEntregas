const db = require("../database/DatabaseSQL");

class MotoristasRepositorySQL {

  // Listar todos
  listarTodos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, cpf, placaVeiculo, status
        FROM motoristas
      `;

      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Buscar por ID
  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, cpf, placaVeiculo, status
        FROM motoristas
        WHERE id = ?
      `;

      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Buscar por CPF
  buscarPorCPF(cpf) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, nome, cpf, placaVeiculo, status
        FROM motoristas
        WHERE cpf = ?
      `;

      db.get(sql, [cpf], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Inserção
  criar(dados) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO motoristas (nome, cpf, placaVeiculo, status)
        VALUES (?, ?, ?, ?)
      `;

      const valores = [
        dados.nome,
        dados.cpf,
        dados.placaVeiculo,
        dados.status
      ];

      db.run(sql, valores, function (err) {
        if (err) reject(err);
        else {
          db.get("SELECT last_insert_rowid() as id", [], (err2, row) => {
            if (err2) reject(err2);
            else resolve({ ...dados, id: row.id });
          });
        }
      });
    });
  }

  // Atualização
  atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE motoristas
        SET nome = ?, cpf = ?, placaVeiculo = ?, status = ?
        WHERE id = ?
      `;

      const valores = [
        dados.nome,
        dados.cpf,
        dados.placaVeiculo,
        dados.status,
        id
      ];

      db.run(sql, valores, (err) => {
        if (err) reject(err);
        else resolve({ id, ...dados });
      });
    });
  }

  // Remoção
  deletar(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM motoristas
        WHERE id = ?
      `;

      db.run(sql, [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = MotoristasRepositorySQL;