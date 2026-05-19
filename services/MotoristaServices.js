// Regras de negócio de motorista

class MotoristasService {
  constructor(motoristasRepository) {
    this.motoristasRepository = motoristasRepository;
  }

  async criarMotorista({ nome, cpf, placaVeiculo }) {
    // Regra: CPF único
    const existente = await this.motoristasRepository.buscarPorCPF(cpf);

    if (existente) {
      const erro = new Error("CPF já cadastrado");
      erro.status = 409;
      throw erro;
    }

    return await this.motoristasRepository.criar({
      nome,
      cpf,
      placaVeiculo,
      status: "ATIVO"
    });
  }

  async listar(statusOrFiltros) {
    const filtros = typeof statusOrFiltros === "object" ? statusOrFiltros : { status: statusOrFiltros };
    return await this.motoristasRepository.listarTodos(filtros);
  }

  async buscarPorId(id) {
    const motorista = await this.motoristasRepository.buscarPorId(id);

    if (!motorista) {
      throw new Error("Motorista não encontrado");
    }

    return motorista;
  }

  async alternarStatus(id) {
    const motorista = await this.buscarPorId(id);

    // Alterna o status: se ATIVO -> INATIVO, se INATIVO -> ATIVO
    motorista.status = motorista.status === "ATIVO" ? "INATIVO" : "ATIVO";

    return await this.motoristasRepository.atualizar(id, motorista);
  }
}


module.exports = MotoristasService;