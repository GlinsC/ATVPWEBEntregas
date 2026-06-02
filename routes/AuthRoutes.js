const express = require("express");
const autenticar = require("../middlewares/autenticar");

function authRoutes(controller) {
  const router = express.Router();

  router.post("/auth/login", controller.login);
  router.post("/auth/registrar", controller.register);
  router.get("/auth/me", autenticar, controller.me);

  return router;
}

module.exports = {
  authRoutes
};
