const bcrypt = require("bcrypt");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async criarUsuario({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      const error = new Error("Nome, email e senha são obrigatórios");
      error.status = 400;
      throw error;
    }

    if (senha.length < 8) {
      const error = new Error("Senha deve ter pelo menos 8 caracteres");
      error.status = 400;
      throw error;
    }

    const existente = await this.userRepository.buscarPorEmail(email);
    if (existente) {
      const error = new Error("Email já cadastrado");
      error.status = 409;
      throw error;
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    return await this.userRepository.criar({
      nome,
      email,
      senha: senhaHash
    });
  }

  async autenticar(email, senha) {
    if (!email || !senha) {
      const error = new Error("Email e senha são obrigatórios");
      error.status = 400;
      throw error;
    }

    const usuario = await this.userRepository.buscarPorEmail(email);
    if (!usuario) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    return usuario;
  }

  async alterarPapel(id, papel) {
    const papeisValidos = ["OPERADOR", "GESTOR"];
    if (!papeisValidos.includes(papel)) {
      const error = new Error("Papel inválido. Use OPERADOR ou GESTOR.");
      error.status = 400;
      throw error;
    }

    const usuario = await this.userRepository.buscarPorId(id);
    if (!usuario) {
      const error = new Error("Usuário não encontrado");
      error.status = 404;
      throw error;
    }

    return await this.userRepository.atualizarPapel(id, papel);
  }
}

module.exports = UserService;
