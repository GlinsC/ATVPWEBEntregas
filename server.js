const express = require("express");
const path = require("path");

// Repositórios com Prisma
const EntregasRepositoryPrisma = require("./repositories/EntregasRepositoriesPrisma");
const MotoristasRepositoryPrisma = require("./repositories/MotoristaRepositoriesPrisma");
const UserRepositoryPrisma = require("./repositories/UserRepositoryPrisma");

// Services
const EntregasService = require("./services/EntregasServices");
const MotoristasService = require("./services/MotoristaServices");
const UserService = require("./services/UserService");
const AuthService = require("./services/AuthService");

// Controllers
const EntregasController = require("./controllers/EntregasControllers");
const MotoristasController = require("./controllers/MotoristaControllers");
const AuthController = require("./controllers/AuthController");
const AuthViewController = require("./controllers/AuthViewController");
const UserController = require("./controllers/UserController");

// Routes
const { entregasRoutes, painelEntregasRoutes } = require("./routes/EntregasRoutes");
const { motoristasRoutes, painelMotoristaRoutes } = require("./routes/MotoristaRoutes");
const { authRoutes } = require("./routes/AuthRoutes");
const { userRoutes } = require("./routes/UserRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// INJEÇÃO DE DEPENDÊNCIA - Usando Prisma
const entregasRepository = new EntregasRepositoryPrisma();
const motoristasRepository = new MotoristasRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();

// Services
const entregasService = new EntregasService(
  entregasRepository,
  motoristasRepository
);

const motoristasService = new MotoristasService(motoristasRepository);
const userService = new UserService(userRepository);
const authService = new AuthService(userService);

// Controllers
const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(
  motoristasService,
  entregasService
);
const authController = new AuthController(authService);
const authViewController = new AuthViewController();
const userController = new UserController(userService);

// Rotas de visão
app.get("/login", authViewController.loginPage);
app.get("/registrar", authViewController.registrarPage);

// Rotas
app.use("/api", authRoutes(authController));
app.use("/api", userRoutes(userController));
app.use("/api", entregasRoutes(entregasController));
app.use("/api", motoristasRoutes(motoristasController));
app.use("/", painelEntregasRoutes(entregasController));
app.use("/", painelMotoristaRoutes(motoristasController));

app.get("/", (req, res) => {
  res.redirect("/login");
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;