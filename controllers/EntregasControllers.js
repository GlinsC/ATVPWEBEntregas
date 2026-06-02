// Controller = ponte entre HTTP e Service
// Ele NÃO deve conter regras de negócio

const STATUS = require("../utils/Status");

class EntregasController {
  constructor(service) {
    this.service = service;
  }

  isPainelRequest = (req) => {
    return req.path.startsWith("/painel");
  };

  getStatusOptions = () => [STATUS.CRIADA, STATUS.EM_TRANSITO, STATUS.ENTREGUE, STATUS.CANCELADA];

  renderEntregasPage = async (req, res, options = {}) => {
    const { status, page, limit, createdDe, createdAte } = req.query;
    const filtros = {
      status,
      page: page || 1,
      limit: limit || 20,
      createdDe,
      createdAte
    };

    const resultado = await this.service.listarEntregas(filtros, req.query.incluirHistorico === "true");
    const entregas = resultado.data || resultado;

    return res.render("entregas", {
      entregas,
      statusOptions: this.getStatusOptions(),
      selectedStatus: status || "",
      errorMessage: options.errorMessage || "",
      successMessage: options.successMessage || "",
      formData: options.formData || {}
    });
  };

  criar = async (req, res) => {
    try {
      const entrega = await this.service.criarEntrega({
        ...req.body,
        criadorId: req.usuario.id
      });
      if (this.isPainelRequest(req)) {
        return res.redirect("/painel/entregas?success=Entrega criada com sucesso");
      }
      res.status(201).json(entrega);
    } catch (error) {
      if (this.isPainelRequest(req)) {
        return await this.renderEntregasPage(req, res, {
          errorMessage: error.message,
          formData: req.body
        });
      }
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

      if (this.isPainelRequest(req)) {
        return res.render("entregas", {
          entregas: resultado.data || resultado,
          statusOptions: this.getStatusOptions(),
          selectedStatus: status || "",
          errorMessage: req.query.error || "",
          successMessage: req.query.success || "",
          formData: {}
        });
      }

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
      if (this.isPainelRequest(req)) {
        return await this.renderEntregasPage(req, res, {
          errorMessage: error.message
        });
      }
      res.status(400).json({ erro: error.message });
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
      if (this.isPainelRequest(req)) {
        return res.render("entrega", {
          entrega,
          statusOptions: this.getStatusOptions(),
          errorMessage: req.query.error || "",
          successMessage: req.query.success || ""
        });
      }
      res.json(entrega);

    } catch (error) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(error.message)}`);
      }
      res.status(404).json({ erro: error.message });
    }
  };

  avancar = async (req, res) => {
    try {
      const entrega = await this.service.avancarStatus(Number(req.params.id));
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?success=${encodeURIComponent("Status atualizado com sucesso")}`);
      }
      res.json(entrega);

    } catch (error) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(error.message)}`);
      }
      res.status(400).json({ erro: error.message });
    }
  };

  cancelar = async (req, res) => {
    try {
      const entrega = await this.service.cancelarEntrega(Number(req.params.id));
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?success=${encodeURIComponent("Entrega cancelada")}`);
      }
      res.json(entrega);

    } catch (error) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(error.message)}`);
      }
      res.status(400).json({ erro: error.message });
    }
  };

  atribuir = async (req, res) => {
    try {
      const { motoristaId } = req.body;
      const entrega = await this.service.atribuirMotorista(Number(req.params.id), Number(motoristaId));
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?success=${encodeURIComponent("Motorista atribuído com sucesso")}`);
      }
      res.json(entrega);

    } catch (error) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(error.message)}`);
      }
      res.status(error.status || 400).json({ erro: error.message });
    }
  };

  relatorioStatus = async (req, res) => {
    try {
      const data = await this.service.relatorioPorStatus();
      if (this.isPainelRequest(req)) {
        return res.render("relatorios", {
          title: "Relatório por Status",
          statusReport: data,
          activeMotoristas: null
        });
      }
      res.json(data);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(e.message)}`);
      }
      res.status(400).json({ erro: e.message });
    }
  };

  relatorioMotoristasAtivos = async (req, res) => {
    try {
      const data = await this.service.relatorioMotoristasAtivos();
      if (this.isPainelRequest(req)) {
        return res.render("relatorios", {
          title: "Relatórios de Motoristas Ativos",
          statusReport: null,
          activeMotoristas: data
        });
      }
      res.json(data);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/entregas?error=${encodeURIComponent(e.message)}`);
      }
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