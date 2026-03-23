const express = require("express");

// Recebe controller via injeção de dependência
function entregasRoutes(controller) {
  const router = express.Router();

  // Cada rota chama um método do controller

  router.post("/entregas", controller.criar);
  router.get("/entregas", controller.listar);
  router.get("/entregas/:id", controller.buscarPorId);

  router.patch("/entregas/:id/avancar", controller.avancar);
  router.patch("/entregas/:id/cancelar", controller.cancelar);

  router.get("/entregas/:id/historico", controller.historico);

  return router;
}

module.exports = entregasRoutes;