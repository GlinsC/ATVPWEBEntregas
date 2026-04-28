const express = require("express");

// Repositórios com Prisma
const EntregasRepositoryPrisma = require("./repositories/EntregasRepositoriesPrisma");
const MotoristasRepositoryPrisma = require("./repositories/MotoristaRepositoresPrisma");

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

// INJEÇÃO DE DEPENDÊNCIA - Usando Prisma
const entregasRepository = new EntregasRepositoryPrisma();
const motoristasRepository = new MotoristasRepositoryPrisma();

// Services
const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository
);

const motoristasService = new MotoristasService(motoristasRepository);

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