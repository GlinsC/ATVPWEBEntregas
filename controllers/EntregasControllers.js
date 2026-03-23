// Controller = ponte entre HTTP e Service
// Ele NÃO deve conter regras de negócio

class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      // req.body vem da requisição HTTP
      const entrega = this.service.criarEntrega(req.body);

      // resposta HTTP
      res.status(201).json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  listar = (req, res) => {
    const { status } = req.query;

    const entregas = this.service.listarEntregas(status);

    res.json(entregas);
  };

  buscarPorId = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  };

  avancar = (req, res) => {
    try {
      const entrega = this.service.avancarStatus(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  cancelar = (req, res) => {
    try {
      const entrega = this.service.cancelarEntrega(Number(req.params.id));
      res.json(entrega);

    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  historico = (req, res) => {
    try {
      const historico = this.service.historico(Number(req.params.id));
      res.json(historico);

    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  };
}

module.exports = EntregasController;