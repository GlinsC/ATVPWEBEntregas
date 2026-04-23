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

    const novaEntrega = {
      id: null,
      descricao,
      origem,
      destino,
      status: STATUS.CRIADA,
      motoristaId: null
    };

    const entregaCriada = await this.entregasRepository.criar(novaEntrega);
    await this.entregasRepository.criarEvento(entregaCriada.id, "Entrega criada");

    return {
      ...entregaCriada,
      historico: [
        {
          entregaId: entregaCriada.id,
          data: new Date().toISOString(),
          descricao: "Entrega criada"
        }
      ]
    };
  }

  async listarEntregas(status, incluirHistorico = false) {
    const entregas = await this.entregasRepository.listarTodos();

    const filtradas = status ? entregas.filter(e => e.status === status) : entregas;

    if (!incluirHistorico) {
      return filtradas;
    }

    const promessas = filtradas.map(async entrega => {
      const historico = await this.entregasRepository.listarHistorico(entrega.id);
      return { ...entrega, historico };
    });

    return await Promise.all(promessas);
  }

  async buscarPorId(id) {
    const entrega = await this.entregasRepository.buscarPorId(id);

    if (!entrega) {
      throw new Error("Entrega não encontrada");
    }

    const historico = await this.entregasRepository.listarHistorico(id);
    return { ...entrega, historico };
  }

  async avancarStatus(id) {
    const entrega = await this.buscarPorId(id);

    const statusAnterior = entrega.status;

    if (entrega.status === STATUS.CRIADA) {
      entrega.status = STATUS.EM_TRANSITO;
    } else if (entrega.status === STATUS.EM_TRANSITO) {
      entrega.status = STATUS.ENTREGUE;
    } else {
      throw new Error("Não é possível avançar o status");
    }

    const entregaAtualizada = await this.entregasRepository.atualizar(id, entrega);
    await this.entregasRepository.criarEvento(id, `Status alterado de ${statusAnterior} para ${entregaAtualizada.status}`);

    const historico = await this.entregasRepository.listarHistorico(id);
    return { ...entregaAtualizada, historico };
  }

  async cancelarEntrega(id) {
    const entrega = await this.buscarPorId(id);

    if (entrega.status === STATUS.ENTREGUE) {
      throw new Error("Não pode cancelar entrega finalizada");
    }

    entrega.status = STATUS.CANCELADA;

    const entregaAtualizada = await this.entregasRepository.atualizar(id, entrega);
    await this.entregasRepository.criarEvento(id, "Entrega cancelada");

    const historico = await this.entregasRepository.listarHistorico(id);
    return { ...entregaAtualizada, historico };
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

    const entregaAtualizada = await this.entregasRepository.atualizar(entregaId, entrega);
    await this.entregasRepository.criarEvento(entregaId, `Motorista atribuído: ${motorista.nome} (id ${motoristaId})`);

    const historico = await this.entregasRepository.listarHistorico(entregaId);
    return { ...entregaAtualizada, historico };
  }

  async buscarPorMotorista(motoristaId, status) {
    const entregas = await this.entregasRepository.listarTodos();

    return entregas.filter(e => {
      return e.motoristaId === motoristaId &&
        (!status || e.status === status);
    });
  }

  async relatorioPorStatus() {
    return await this.entregasRepository.relatorioPorStatus();
  }

  async relatorioMotoristasAtivos() {
    const motoristas = await this.motoristasRepository.listarTodos();
    const ativos = motoristas.filter(m => m.status === 'ATIVO');

    const resultado = await Promise.all(ativos.map(async motorista => {
      const entregas = await this.buscarPorMotorista(motorista.id);
      const entregasEmAberto = entregas.filter(e => e.status !== STATUS.ENTREGUE && e.status !== STATUS.CANCELADA).length;
      return {
        motoristaId: motorista.id,
        nome: motorista.nome,
        entregasEmAberto
      };
    }));

    return resultado;
  }

  async relatorioMotoristaAtivoDetalhado(motoristaId) {
    const motorista = await this.motoristasRepository.buscarPorId(motoristaId);
    
    if (!motorista) {
      throw new Error("Motorista não encontrado");
    }

    if (motorista.status !== 'ATIVO') {
      throw new Error("Motorista não está ativo");
    }

    const entregas = await this.buscarPorMotorista(motoristaId);
    
    return {
      motorista,
      entregas
    };
  }
}

module.exports = EntregasService;