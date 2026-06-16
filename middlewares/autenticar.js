const jwt = require("jsonwebtoken");

function obterToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map(item => item.trim())
    .find(item => item.startsWith("token="));

  return cookie ? decodeURIComponent(cookie.slice("token=".length)) : null;
}

function isApiRequest(req) {
  return req.originalUrl.startsWith('/api') || req.baseUrl.startsWith('/api');
}

function autenticar(req, res, next) {
  const token = obterToken(req);

  if (!token) {
    if (!isApiRequest(req) && req.accepts('html')) {
      return res.redirect('/login?error=' + encodeURIComponent('Token não fornecido'));
    }

    return res.status(401).json({
      erro: 'Token não fornecido'
    });
  }
  const secret = process.env.JWT_SECRET || "segredo";

  try {
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      if (!isApiRequest(req) && req.accepts('html')) {
        return res.redirect('/login?error=' + encodeURIComponent('Token expirado'));
      }
      return res.status(401).json({ erro: 'Token expirado' });
    }

    if (!isApiRequest(req) && req.accepts('html')) {
      return res.redirect('/login?error=' + encodeURIComponent('Token inválido'));
    }

    return res.status(401).json({
      erro: 'Token inválido'
    });
  }
}

module.exports = autenticar;