const express = require("express");

// Recebe controller via injeção de dependência
function entregasRoutes(controller) {
  const router = express.Router();

  // Cada rota chama um método do controller
  router.post("/entregas", controller.criar);
  router.get("/entregas", controller.listar);
  router.get("/entregas/:id", controller.buscarPorId);
  router.get("/entregas/:id/historico", controller.buscarHistorico);

  router.patch("/entregas/:id/avancar", controller.avancar);
  router.patch("/entregas/:id/cancelar", controller.cancelar);
  router.get("/relatorios/entregas-por-status", controller.relatorioStatus);
  router.get("/relatorios/motoristas-ativos/:id", controller.relatorioMotoristaAtivoDetalhado);
  router.get("/relatorios/motoristas-ativos", controller.relatorioMotoristasAtivos);
  router.patch("/entregas/:id/atribuir", controller.atribuir);

  return router;
}

function painelEntregasRoutes(controller) {
  const router = express.Router();
  router.get("/painel/entregas", controller.painelEntregas);
  return router;
}

module.exports = {
  entregasRoutes,
  painelEntregasRoutes
};