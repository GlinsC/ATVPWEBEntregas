function isApiRequest(req) {
  return req.originalUrl.startsWith('/api') || req.baseUrl.startsWith('/api');
}

function autorizar(...papeis) {
  return (req, res, next) => {
    const usuarioPapel = req.usuario && req.usuario.papel;

    if (!papeis.includes(usuarioPapel)) {
      const mensagem = "Acesso negado. Você precisa de permissão de gestor.";

      if (!isApiRequest(req) && req.accepts("html")) {
        const referer = req.get("referer");
        const fallbackPath = "/painel/entregas";
        const redirectPath = referer
          ? new URL(referer, `${req.protocol}://${req.get("host")}`).pathname
          : fallbackPath;

        return res.redirect(
          `${redirectPath}?error=${encodeURIComponent(mensagem)}`
        );
      }

      return res.status(403).json({ erro: mensagem });
    }

    next();
  };
}

module.exports = autorizar;