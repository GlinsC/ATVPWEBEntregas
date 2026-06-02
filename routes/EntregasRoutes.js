const express = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");

// Recebe controller via injeção de dependência
function entregasRoutes(controller) {
  const router = express.Router();
  router.use(autenticar);

  // Cada rota chama um método do controller
  router.post("/entregas", controller.criar);
  router.get("/entregas", controller.listar);
  router.get("/entregas/:id", controller.buscarPorId);
  router.get("/entregas/:id/historico", controller.buscarHistorico);

  router.patch("/entregas/:id/avancar", controller.avancar);
  router.patch("/entregas/:id/cancelar", autorizar("GESTOR"), controller.cancelar);
  router.get("/relatorios/entregas-por-status", autorizar("GESTOR"), controller.relatorioStatus);
  router.get("/relatorios/motoristas-ativos/:id", autorizar("GESTOR"), controller.relatorioMotoristaAtivoDetalhado);
  router.get("/relatorios/motoristas-ativos", autorizar("GESTOR"), controller.relatorioMotoristasAtivos);
  router.patch("/entregas/:id/atribuir", controller.atribuir);

  return router;
}

function painelEntregasRoutes(controller) {
  const router = express.Router();
  router.use(autenticar);

  router.get("/painel/entregas", controller.listar);
  router.post("/painel/entregas", controller.criar);
  router.get("/painel/entregas/:id", controller.buscarPorId);
  router.post("/painel/entregas/:id/avancar", controller.avancar);
  router.post("/painel/entregas/:id/cancelar", autorizar("GESTOR"), controller.cancelar);
  router.post("/painel/entregas/:id/atribuir", controller.atribuir);
  router.get("/painel/relatorios/entregas-por-status", autorizar("GESTOR"), controller.relatorioStatus);
  router.get("/painel/relatorios/motoristas-ativos", autorizar("GESTOR"), controller.relatorioMotoristasAtivos);

  return router;
}

module.exports = {
  entregasRoutes,
  painelEntregasRoutes
};