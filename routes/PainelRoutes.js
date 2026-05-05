const express = require("express");

// Recebe services via injeção de dependência
function painelRoutes(entregasService, motoristasService) {
  const router = express.Router();

  // Rotas do painel
  router.get("/painel/entregas", async (req, res) => {
    try {
      const resultado = await entregasService.listarEntregas({ page: 1, limit: 20 });
      const entregas = resultado.data || resultado;
      res.render("entregas", { entregas });
    } catch (error) {
      res.status(500).send("Erro ao carregar a página de entregas");
    }
  });

  router.get("/painel/motorista", async (req, res) => {
    try {
      const motoristas = await motoristasService.listar();
      const resultado = await entregasService.listarEntregas({ page: 1, limit: 50 });
      const entregas = resultado.data || resultado;
      res.render("motorista", { motoristas, entregas });
    } catch (error) {
      res.status(500).send("Erro ao carregar o painel do motorista");
    }
  });

  return router;
}

module.exports = painelRoutes;