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
        else {
          db.get("SELECT last_insert_rowid() as id", [], (err2, row) => {
            if (err2) reject(err2);
            else resolve({ ...dados, id: row.id });
          });
        }
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

  // Histórico de eventos
  criarEvento(entregaId, descricao) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO eventos_entrega (entregaId, data, descricao)
        VALUES (?, ?, ?)
      `;

      const valores = [entregaId, new Date().toISOString(), descricao];

      db.run(sql, valores, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, entregaId, data: valores[1], descricao });
      });
    });
  }

  listarHistorico(entregaId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT id, entregaId, data, descricao
        FROM eventos_entrega
        WHERE entregaId = ?
        ORDER BY data ASC
      `;

      db.all(sql, [entregaId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  relatorioPorStatus() {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT status, COUNT(*) as total
      FROM entregas
      GROUP BY status
    `;

      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else {
          const resultado = {};

          rows.forEach(r => {
            resultado[r.status] = r.total;
          });

          resolve(resultado);
        }
      });
    });
  }

}

module.exports = EntregasRepositorySQL;