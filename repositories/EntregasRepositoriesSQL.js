const db = require("../database/DatabaseSQL");

class EntregasRepositorySQL {

  // 🔍 Buscar todas as entregas
  listarTodos() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, descricao, origem, destino, status, motoristaId
        FROM entregas
      `;

      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 🔍 Buscar por ID
  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, descricao, origem, destino, status, motoristaId
        FROM entregas
        WHERE id = ?
      `;

      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // ➕ Inserção
  criar(dados) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO entregas (descricao, origem, destino, status, motoristaId)
        VALUES (?, ?, ?, ?, ?)
      `;

      const valores = [
        dados.descricao,
        dados.origem,
        dados.destino,
        dados.status,
        dados.motoristaId || null
      ];

      db.run(sql, valores, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...dados });
      });
    });
  }

  // ✏️ Atualização
  atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE entregas
        SET descricao = ?, origem = ?, destino = ?, status = ?, motoristaId = ?
        WHERE id = ?
      `;

      const valores = [
        dados.descricao,
        dados.origem,
        dados.destino,
        dados.status,
        dados.motoristaId,
        id
      ];

      db.run(sql, valores, (err) => {
        if (err) reject(err);
        else resolve({ id, ...dados });
      });
    });
  }

  // ❌ Remoção (opcional)
  deletar(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM entregas
        WHERE id = ?
      `;

      db.run(sql, [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = EntregasRepositorySQL;