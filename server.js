const express = require("express");

// Database
const Database = require("./database/DatabaseSQL");

// Repositories
const EntregasRepository = require("./repositories/EntregasRepositoriesSQL");
const MotoristasRepository = require("./repositories/MotoristaRepositoresSQL");

// Services
const EntregasService = require("./services/EntregasServices");
const MotoristasService = require("./services/MotoristaServices");

// Controllers
const EntregasController = require("./controllers/EntregasControllers");
const MotoristasController = require("./controllers/MotoristaControllers");

// Routes
const entregasRoutes = require("./routers/EntregasRouters");
const motoristasRoutes = require("./routers/MotoristaRouters");

const server = express();
server.use(express.json());

//INJEÇÃO DE DEPENDÊNCIA


// Banco (compartilhado)
const database = Database;

// Repositories
const entregasRepository = new EntregasRepository(database);
const motoristasRepository = new MotoristasRepository(database);

// Services
const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository // integração acontece aqui
);

const motoristasService = new MotoristasService(
  motoristasRepository
);

// Controllers
const entregasController = new EntregasController(entregasService);

const motoristasController = new MotoristasController(
  motoristasService,
  entregasService
);

// Rotas
server.use("/api", entregasRoutes(entregasController));
server.use("/api", motoristasRoutes(motoristasController));

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});