const express = require("express");

function motoristasRoutes(controller) {
  const router = express.Router();

  router.post("/motoristas", controller.criar);
  router.get("/motoristas", controller.listar);
  router.get("/motoristas/:id", controller.buscar);
  router.get("/motoristas/:id/entregas", controller.entregas);
  router.patch("/motoristas/:id/status", controller.alternarStatus);

  return router;
}

function painelMotoristaRoutes(controller) {
  const router = express.Router();
  router.get("/painel/motorista", controller.painelMotorista);
  return router;
}

module.exports = {
  motoristasRoutes,
  painelMotoristaRoutes
};