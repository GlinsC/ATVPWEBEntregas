// Controller = ponte entre HTTP e Service
// Ele NÃO deve conter regras de negócio

class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res) => {
    try {
      // req.body vem da requisição HTTP
      const entrega = await this.service.criarEntrega(req.body);

      // resposta HTTP
      res.status(201).json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  listar = async (req, res) => {
    const { status } = req.query;

    const entregas = await this.service.listarEntregas(status);

    res.json(entregas);
  };

  buscarPorId = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  };

  avancar = async (req, res) => {
    try {
      const entrega = await this.service.avancarStatus(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  cancelar = async (req, res) => {
    try {
      const entrega = await this.service.cancelarEntrega(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  atribuir = async (req, res) => {
    try {
      const { motoristaId } = req.body;
      const entrega = await this.service.atribuirMotorista(Number(req.params.id), motoristaId);
      res.json(entrega);

    } catch (error) {
      res.status(error.status || 400).json({ erro: error.message });
    }
  };
}

module.exports = EntregasController;