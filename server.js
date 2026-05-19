const express = require("express");
const path = require("path");

// Repositórios com Prisma
const EntregasRepositoryPrisma = require("./repositories/EntregasRepositoriesPrisma");
const MotoristasRepositoryPrisma = require("./repositories/MotoristaRepositoriesPrisma");

// Services
const EntregasService = require("./services/EntregasServices");
const MotoristasService = require("./services/MotoristaServices");

// Controllers
const EntregasController = require("./controllers/EntregasControllers");
const MotoristasController = require("./controllers/MotoristaControllers");

// Routes
const { entregasRoutes, painelEntregasRoutes } = require("./routes/EntregasRoutes");
const { motoristasRoutes, painelMotoristaRoutes } = require("./routes/MotoristaRoutes");

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

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
server.use("/", painelEntregasRoutes(entregasController));
server.use("/", painelMotoristaRoutes(motoristasController));

server.get("/", (req, res) => {
  res.redirect("/painel/entregas");
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});