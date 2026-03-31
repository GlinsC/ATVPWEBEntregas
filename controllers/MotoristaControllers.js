class MotoristasController {
  constructor(service, entregasService) {
    this.service = service;
    this.entregasService = entregasService;
  }

  criar = (req, res) => {
    try {
      const motorista = this.service.criarMotorista(req.body);
      res.status(201).json(motorista);
    } catch (e) {
      res.status(e.status || 400).json({ erro: e.message });
    }
  };

  listar = (req, res) => {
    const { status } = req.query;

    const motoristas = this.service.listar(status);

    res.json(motoristas);
  };

  buscar = (req, res) => {
    try {
      const motorista = this.service.buscarPorId(Number(req.params.id));
      res.json(motorista);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };

  entregas = (req, res) => {
    const { status } = req.query;

    const entregas = this.entregasService.buscarPorMotorista(
      Number(req.params.id),
      status
    );

    res.json(entregas);
  };

  alternarStatus = (req, res) => {
    try {
      const motorista = this.service.alternarStatus(Number(req.params.id));
      res.json(motorista);
    } catch (e) {
      res.status(404).json({ erro: e.message });
    }
  };
}

module.exports = MotoristasController;