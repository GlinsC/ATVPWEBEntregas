const express = require("express");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");

function userRoutes(controller) {
  const router = express.Router();
  router.use(autenticar);

  router.patch("/usuarios/:id/papel", controller.alterarPapel);

  return router;
}

module.exports = {
  userRoutes
};
