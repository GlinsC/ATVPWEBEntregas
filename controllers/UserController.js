class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  alterarPapel = async (req, res) => {
    try {
      const { papel } = req.body;
      const { id } = req.params;
      const usuario = await this.userService.alterarPapel(Number(id), papel);
      res.json({ mensagem: "Papel alterado com sucesso", usuario });
    } catch (error) {
      res.status(error.status || 400).json({ erro: error.message });
    }
  };
}

module.exports = UserController;
