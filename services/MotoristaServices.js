// Regras de negócio de motorista

class MotoristasService {
  constructor(motoristasRepository) {
    this.motoristasRepository = motoristasRepository;
  }

  criarMotorista({ nome, cpf, placaVeiculo }) {
    // 🔴 Regra: CPF único
    const existente = this.motoristasRepository.buscarPorCPF(cpf);

    if (existente) {
      const erro = new Error("CPF já cadastrado");
      erro.status = 409;
      throw erro;
    }

    return this.motoristasRepository.criar({
      nome,
      cpf,
      placaVeiculo,
      status: "ATIVO"
    });
  }

  listar(status) {
    const motoristas = this.motoristasRepository.listarTodos();

    // Se vier filtro de status, aplica
    if (status) {
      return motoristas.filter(m => m.status === status);
    }

    return motoristas;
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepository.buscarPorId(id);

    if (!motorista) {
      throw new Error("Motorista não encontrado");
    }

    return motorista;
  }

  alternarStatus(id) {
    const motorista = this.buscarPorId(id);

    // Alterna o status: se ATIVO -> INATIVO, se INATIVO -> ATIVO
    motorista.status = motorista.status === "ATIVO" ? "INATIVO" : "ATIVO";

    return this.motoristasRepository.atualizar(id, motorista);
  }
}


module.exports = MotoristasService;