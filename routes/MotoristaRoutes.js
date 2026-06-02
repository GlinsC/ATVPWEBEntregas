const express = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");

function motoristasRoutes(controller) {
  const router = express.Router();
  router.use(autenticar);

  router.post("/motoristas", autorizar("GESTOR"), controller.criar);
  router.get("/motoristas", controller.listar);
  router.get("/motoristas/:id", controller.buscar);
  router.get("/motoristas/:id/entregas", controller.entregas);
  router.patch("/motoristas/:id/status", autorizar("GESTOR"), controller.alternarStatus);

  return router;
}

function painelMotoristaRoutes(controller) {
  const router = express.Router();
  router.use(autenticar);

  router.get("/painel/motorista", controller.listar);
  router.post("/painel/motorista", autorizar("GESTOR"), controller.criar);
  router.get("/painel/motorista/:id", controller.buscar);
  router.post("/painel/motorista/:id/status", autorizar("GESTOR"), controller.alternarStatus);

  return router;
}

module.exports = {
  motoristasRoutes,
  painelMotoristaRoutes
};