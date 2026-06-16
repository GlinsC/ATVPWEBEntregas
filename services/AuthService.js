const jwt = require("jsonwebtoken");

class AuthService {
  constructor(userService) {
    this.userService = userService;
    this.jwtSecret = process.env.JWT_SECRET || "segredo";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "8h";
  }

  async login(email, senha) {
    if (!email || !senha) {
      const error = new Error("Email e senha são obrigatórios");
      error.status = 400;
      throw error;
    }

    const usuario = await this.userService.autenticar(email, senha);
    const tokenPayload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel
    };

    const accessToken = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    const refreshToken = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    });

    return {
      mensagem: "Login realizado com sucesso",
      accessToken,
      refreshToken,
      token: accessToken,
      usuario: tokenPayload
    };
  }

  async register(dados) {
    return await this.userService.criarUsuario(dados);
  }
}

module.exports = AuthService;
