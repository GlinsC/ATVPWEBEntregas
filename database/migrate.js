const fs = require("fs");
const path = require("path");
const db = require("./DatabaseSQL");

const migrationsPath = path.join(__dirname, "migration");

db.serialize(() => {
  // tabela de controle
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      executado_em TEXT NOT NULL
    )
  `);

  // buscar migrations já executadas
  db.all("SELECT nome FROM migrations", [], (err, rows) => {
    if (err) throw err;

    const executadas = rows.map(r => r.nome);

    const arquivos = fs.readdirSync(migrationsPath).sort();

    arquivos.forEach(file => {
      if (!executadas.includes(file)) {
        const sql = fs.readFileSync(
          path.join(migrationsPath, file),
          "utf-8"
        );

        console.log("Executando migration:", file);

        db.exec(sql, (err) => {
          if (err) {
            console.error("Erro ao executar migration:", file, err);
            throw err;
          }

          db.run(
            "INSERT INTO migrations (nome, executado_em) VALUES (?, ?)",
            [file, new Date().toISOString()],
            (err) => {
              if (err) console.error("Erro ao registrar migration:", err);
              else console.log("Migration registrada:", file);
            }
          );
        });
      }
    });
  });
});