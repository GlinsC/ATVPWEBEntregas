class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { email, senha } = req.body;
      const result = await this.authService.login(email, senha);
      res.json(result);
    } catch (error) {
      res.status(error.status || 401).json({ erro: error.message });
    }
  };

  register = async (req, res) => {
    try {
      const usuario = await this.authService.register(req.body);
      res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        createdAt: usuario.createdAt
      });
    } catch (error) {
      res.status(error.status || 400).json({ erro: error.message });
    }
  };

  me = async (req, res) => {
    res.json({ usuario: req.usuario });
  };

  ativoArea = async (req, res) => {
    res.json({ mensagem: "Acesso permitido para motorista ATIVO", usuario: req.usuario });
  };
}

module.exports = AuthController;
