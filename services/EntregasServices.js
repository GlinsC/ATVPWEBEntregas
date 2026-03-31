const STATUS = require("../utils/Status");

class EntregasService {
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepository = entregasRepository;
    this.motoristasRepository = motoristasRepository;
  }

  criarEntrega({ descricao, origem, destino }) {
    // 🔴 REGRA: origem não pode ser igual ao destino
    if (origem === destino) {
      throw new Error("Origem e destino não podem ser iguais");
    }

    const entregas = this.entregasRepository.listarTodos();

    // 🔴 REGRA: evitar duplicidade ativa
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

    // Criando objeto da entrega
    const novaEntrega = {
      id: null,
      descricao,
      origem,
      destino,
      status: STATUS.CRIADA,

      // Histórico começa com criação
      historico: [
        {
          data: new Date(),
          descricao: "Entrega criada"
        }
      ]
    };

    // Salva no repository
    return this.entregasRepository.criar(novaEntrega);
  }

  listarEntregas(status) {
    const entregas = this.entregasRepository.listarTodos();

    // Se vier filtro, aplica
    if (status) {
      return entregas.filter(e => e.status === status);
    }

    return entregas;
  }

  buscarPorId(id) {
    const entrega = this.entregasRepository.buscarPorId(id);

    if (!entrega) {
      throw new Error("Entrega não encontrada");
    }

    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    // 🔴 Regras de transição de status
    if (entrega.status === STATUS.CRIADA) {
      entrega.status = STATUS.EM_TRANSITO;

    } else if (entrega.status === STATUS.EM_TRANSITO) {
      entrega.status = STATUS.ENTREGUE;

    } else {
      // Não pode avançar se já terminou ou foi cancelada
      throw new Error("Não é possível avançar o status");
    }

    // Registra no histórico
    entrega.historico.push({
      data: new Date(),
      descricao: `Status alterado para ${entrega.status}`
    });

    return this.entregasRepository.atualizar(id, entrega);
  }

  cancelarEntrega(id) {
    const entrega = this.buscarPorId(id);

    // 🔴 Regra: não pode cancelar depois de entregue
    if (entrega.status === STATUS.ENTREGUE) {
      throw new Error("Não pode cancelar entrega finalizada");
    }

    entrega.status = STATUS.CANCELADA;

    entrega.historico.push({
      data: new Date(),
      descricao: "Entrega cancelada"
    });

    return this.entregasRepository.atualizar(id, entrega);
  }

  historico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  atribuirMotorista(entregaId, motoristaId) {     
    const entrega = this.entregasRepository.buscarPorId(entregaId);
    if (!entrega) throw new Error("Entrega não encontrada");

    // 🔴 Só pode atribuir se estiver CRIADA
    if (entrega.status !== "CRIADA") {
      const erro = new Error("Só pode atribuir motorista em entrega CRIADA");
      erro.status = 422;
      throw erro;
    }

    const motorista = this.motoristasRepository.buscarPorId(motoristaId);

    if (!motorista) throw new Error("Motorista não encontrado");

    // 🔴 Motorista deve estar ativo
    if (motorista.status !== "ATIVO") {
      const erro = new Error("Motorista inativo");
      erro.status = 422;
      throw erro;
    }

    // Atribui motorista
    entrega.motoristaId = motoristaId;

    entrega.historico.push({
      data: new Date(),
      descricao: `Motorista ${motorista.nome} atribuído`
    });

    return this.entregasRepository.atualizar(entregaId, entrega);
  }

  buscarPorMotorista(motoristaId, status) {
    const entregas = this.entregasRepository.listarTodos();

    return entregas.filter(e => {
      return e.motoristaId === motoristaId &&
        (!status || e.status === status);
    });
  }
}

module.exports = EntregasService;