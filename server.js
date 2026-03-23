const express = require("express");

// Importações das camadas
const Database = require("./database/Database");
const EntregasRepository = require("./repositories/EntregasRepositories");
const EntregasService = require("./services/EntregasServices");
const EntregasController = require("./controllers/EntregasControllers");
const entregasRoutes = require("./routers/EntregasRouters");

const server = express();
server.use(express.json());

// 🔥 Injeção de dependência (MUITO IMPORTANTE)
// Aqui "montamos" o sistema

const database = new Database();
const repository = new EntregasRepository(database);
const service = new EntregasService(repository);
const controller = new EntregasController(service);

// Passa controller para as rotas
server.use("/api", entregasRoutes(controller));

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});