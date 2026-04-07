const STATUS = require("../utils/Status");

class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  async criarEntrega({ descricao, origem, destino }) {
    if (origem === destino) {
      throw new Error("Origem e destino não podem ser iguais");
    }

    const entregas = await this.entregasRepository.listarTodos();

    const existeDuplicada = entregas.find(e =>
      e.descricao === descricao &&
      e.origem === origem &&
      e.destino === destino &&
      e.status !== STATUS.ENTREGUE &&
      e.status !== STATUS.CANCELADA
    );

    if (existeDuplicada) {
      throw new Error("Entrega duplicada ativa");
    }

    const now = new Date().toISOString();

    const novaEntrega = {
      id: null,
      descricao,
      origem,
      destino,
      status: STATUS.CRIADA,
      motoristaId: null
    };

    const entregaCriada = await this.entregasRepository.criar(novaEntrega);
    return entregaCriada;
  }

  async listarEntregas(status) {
    const entregas = await this.entregasRepository.listarTodos();

    if (status) {
      return entregas.filter(e => e.status === status);
    }

    return entregas;
  }

  async buscarPorId(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);

    if (!entrega) {
      throw new Error("Entrega não encontrada");
    }

    return entrega;
  }

  async avancarStatus(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === STATUS.CRIADA) {
      entrega.status = STATUS.EM_TRANSITO;
    } else if (entrega.status === STATUS.EM_TRANSITO) {
      entrega.status = STATUS.ENTREGUE;
    } else {
      throw new Error("Não é possível avançar o status");
    }

    return await this.entregasRepository.atualizar(id, entrega);
  }

  async cancelarEntrega(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === STATUS.ENTREGUE) {
      throw new Error("Não pode cancelar entrega finalizada");
    }

    entrega.status = STATUS.CANCELADA;

    return await this.entregasRepository.atualizar(id, entrega);
  }

  async atribuirMotorista(entregaId, motoristaId) {
    const entrega = await this.entregasRepository.buscarPorId(entregaId);
    if (!entrega) throw new Error("Entrega não encontrada");

    if (entrega.status !== STATUS.CRIADA) {
      const erro = new Error("Só pode atribuir motorista em entrega CRIADA");
      erro.status = 422;
      throw erro;
    }

    const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
    if (!motorista) throw new Error("Motorista não encontrado");

    if (motorista.status !== "ATIVO") {
      const erro = new Error("Motorista inativo");
      erro.status = 422;
      throw erro;
    }

    entrega.motoristaId = motoristaId;

    return await this.entregasRepository.atualizar(entregaId, entrega);
  }

  async buscarPorMotorista(motoristaId, status) {
    const entregas = await this.entregasRepository.listarTodos();

    return entregas.filter(e => {
      return e.motoristaId === motoristaId &&
        (!status || e.status === status);
    });
  }
}

module.exports = EntregasService;