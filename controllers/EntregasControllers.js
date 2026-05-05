// Controller = ponte entre HTTP e Service
// Ele NÃO deve conter regras de negócio

class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = async (req, res) => {
    try {
      const entrega = await this.service.criarEntrega(req.body);
      res.status(201).json(entrega);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const { status, incluirHistorico, page, limit, createdDe, createdAte } = req.query;
      const filtros = {
        status,
        page: page || 1,
        limit: limit || 10,
        createdDe,
        createdAte
      };

      const resultado = await this.service.listarEntregas(filtros, incluirHistorico === "true");

      if (resultado.data && resultado.totalPages !== undefined) {
        return res.json({
          mensagem: "Entregas listadas com sucesso",
          data: resultado.data,
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit,
          totalPages: resultado.totalPages
        });
      }

      res.json(resultado);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  };

  painelEntregas = async (req, res) => {
    try {
      const resultado = await this.service.listarEntregas({ page: 1, limit: 20 });
      const entregas = resultado.data || resultado;
      res.render("entregas", { entregas });
    } catch (error) {
      res.status(500).send("Erro ao carregar a página de entregas");
    }
  };

  buscarHistorico = async (req, res) => {
    try {
      const entrega = await this.service.buscarPorId(Number(req.params.id));
      res.json(entrega.historico);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
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
  relatorioStatus = async (req, res) => {
    try {
      const data = await this.service.relatorioPorStatus();
      res.json(data);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  };

  relatorioMotoristasAtivos = async (req, res) => {
    try {
      const data = await this.service.relatorioMotoristasAtivos();
      res.json(data);
    } catch (e) {
      res.status(400).json({ erro: e.message });
    }
  };

  relatorioMotoristaAtivoDetalhado = async (req, res) => {
    try {
      const motoristaId = Number(req.params.id);
      const data = await this.service.relatorioMotoristaAtivoDetalhado(motoristaId);
      res.json(data);
    } catch (e) {
      res.status(e.message === "Motorista não encontrado" ? 404 : 400).json({ erro: e.message });
    }
  };
}

module.exports = EntregasController;