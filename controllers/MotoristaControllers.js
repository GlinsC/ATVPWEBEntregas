// Controller = ponte entre HTTP e Service
// Ele NÃO deve conter regras de negócio

class MotoristasController {
  constructor(service, entregasService) {
    this.service = service;
    this.entregasService = entregasService;
  }

  isPainelRequest = (req) => {
    return req.path.startsWith("/painel");
  };

  getStatusOptions = () => ["ATIVO", "INATIVO"];

  renderMotoristasPage = async (req, res, options = {}) => {
    const { status, page, limit } = req.query;
    const filtros = {
      status,
      page: page || 1,
      limit: limit || 20
    };
    const resultado = await this.service.listar(filtros);
    const motoristas = resultado.data || resultado;

    return res.render("motoristas", {
      motoristas,
      statusOptions: this.getStatusOptions(),
      selectedStatus: status || "",
      errorMessage: options.errorMessage || "",
      successMessage: options.successMessage || "",
      formData: options.formData || {},
      pagination: {
        page: resultado.page || parseInt(page, 10) || 1,
        limit: resultado.limit || parseInt(limit, 10) || 20,
        totalPages: resultado.totalPages || 1,
        total: resultado.total || motoristas.length
      }
    });
  };

  criar = async (req, res) => {
    try {
      const motorista = await this.service.criarMotorista(req.body);
      if (this.isPainelRequest(req)) {
        return res.redirect("/painel/motorista?success=Motorista criado com sucesso");
      }
      res.status(201).json(motorista);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return await this.renderMotoristasPage(req, res, {
          errorMessage: e.message,
          formData: req.body
        });
      }
      res.status(e.status || 400).json({ erro: e.message });
    }
  };

  listar = async (req, res) => {
    try {
      const { status, page, limit } = req.query;
      const filtros = {
        status,
        page: page || 1,
        limit: limit || 10
      };
      const resultado = await this.service.listar(filtros);
      const motoristas = resultado.data || resultado;

      if (this.isPainelRequest(req)) {
        return res.render("motoristas", {
          motoristas,
          statusOptions: this.getStatusOptions(),
          selectedStatus: status || "",
          errorMessage: req.query.error || "",
          successMessage: req.query.success || "",
          formData: {},
          pagination: {
            page: resultado.page || parseInt(page, 10) || 1,
            limit: resultado.limit || parseInt(limit, 10) || 10,
            totalPages: resultado.totalPages || 1,
            total: resultado.total || motoristas.length
          }
        });
      }

      if (resultado.data) {
        return res.json({
          mensagem: "Motoristas listados com sucesso",
          data: resultado.data,
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit,
          totalPages: resultado.totalPages
        });
      }

      res.json(resultado);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return await this.renderMotoristasPage(req, res, {
          errorMessage: e.message
        });
      }
      res.status(500).json({ erro: e.message });
    }
  };

  buscar = async (req, res) => {
    try {
      const motorista = await this.service.buscarPorId(Number(req.params.id));
      if (this.isPainelRequest(req)) {
        // Buscar entregas do motorista para mostrar na view de detalhe
        const entregas = await this.entregasService.buscarPorMotorista(Number(req.params.id));
        return res.render("motorista", {
          motorista,
          entregas: entregas.data || entregas,
          statusOptions: this.getStatusOptions(),
          errorMessage: req.query.error || "",
          successMessage: req.query.success || ""
        });
      }
      res.json(motorista);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/motorista?error=${encodeURIComponent(e.message)}`);
      }
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
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/motorista?success=${encodeURIComponent("Status do motorista alterado com sucesso")}`);
      }
      res.json(motorista);
    } catch (e) {
      if (this.isPainelRequest(req)) {
        return res.redirect(`/painel/motorista?error=${encodeURIComponent(e.message)}`);
      }
      res.status(404).json({ erro: e.message });
    }
  };
}

module.exports = MotoristasController;