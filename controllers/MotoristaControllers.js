class MotoristasController {
  constructor(service, entregasService) {
    this.service = service;
    this.entregasService = entregasService;
  }

  criar = async (req, res) => {
    try {
      const motorista = await this.service.criarMotorista(req.body);
      res.status(201).json(motorista);
    } catch (e) {
      res.status(e.status || 400).json({ erro: e.message });
    }
  };

  listar = async (req, res) => {
    try {
      const { status } = req.query;
      const motoristas = await this.service.listar(status);
      res.json(motoristas);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  };

  buscar = async (req, res) => {
    try {
      const motorista = await this.service.buscarPorId(Number(req.params.id));
      res.json(motorista);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };

  entregas = async (req, res) => {
    try {
      const { status } = req.query;
      const entregas = await this.entregasService.buscarPorMotorista(
        Number(req.params.id),
        status
      );
      res.json(entregas);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  };

  alternarStatus = async (req, res) => {
    try {
      const motorista = await this.service.alternarStatus(Number(req.params.id));
      res.json(motorista);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };
}

module.exports = MotoristasController;