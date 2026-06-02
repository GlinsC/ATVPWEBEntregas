function autorizar(...papeis) {

  return (req, res, next) => {

    if (
      !papeis.includes(
        req.usuario.papel
      )
    ) {
      return res.status(403).json({
        erro: "Acesso negado"
      });
    }

    next();

  };
}

module.exports = autorizar;