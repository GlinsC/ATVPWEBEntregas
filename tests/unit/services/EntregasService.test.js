const STATUS = require('../../../utils/Status');
const EntregasService = require('../../../services/EntregasServices');

describe('EntregasService (unitário)', () => {
  let entregasRepository;
  let motoristasRepository;
  let service;

  beforeEach(() => {
    entregasRepository = {
      listarTodos: jest.fn(),
      criar: jest.fn(),
      criarEvento: jest.fn(),
      buscarPorId: jest.fn(),
      atualizar: jest.fn(),
    };
    motoristasRepository = {
      buscarPorId: jest.fn(),
      listarTodos: jest.fn(),
    };
    service = new EntregasService(entregasRepository, motoristasRepository);
  });

  test('criarEntrega lança erro quando origem e destino são iguais', async () => {
    await expect(
      service.criarEntrega({ descricao: 'Entrega', origem: 'A', destino: 'A', criadorId: 1 })
    ).rejects.toThrow('Origem e destino não podem ser iguais');
  });

  test('criarEntrega lança erro quando já existe entrega duplicada em aberto', async () => {
    entregasRepository.listarTodos.mockResolvedValue([
      { descricao: 'Entrega', origem: 'A', destino: 'B', status: STATUS.CRIADA }
    ]);

    await expect(
      service.criarEntrega({ descricao: 'Entrega', origem: 'A', destino: 'B', criadorId: 1 })
    ).rejects.toThrow('Entrega duplicada ativa');
  });

  test('avancarStatus de CRIADA para EM_TRANSITO retorna entrega atualizada', async () => {
    entregasRepository.buscarPorId.mockResolvedValue({ id: 10, status: STATUS.CRIADA });
    entregasRepository.atualizar.mockResolvedValue({ id: 10, status: STATUS.EM_TRANSITO });
    entregasRepository.criarEvento.mockResolvedValue(undefined);
    entregasRepository.buscarPorId
      .mockResolvedValueOnce({ id: 10, status: STATUS.CRIADA })
      .mockResolvedValueOnce({ id: 10, status: STATUS.EM_TRANSITO });

    const result = await service.avancarStatus(10);

    expect(entregasRepository.atualizar).toHaveBeenCalled();
    expect(result.status).toBe(STATUS.EM_TRANSITO);
  });

  test('avancarStatus de EM_TRANSITO para ENTREGUE retorna status ENTREGUE', async () => {
    entregasRepository.buscarPorId
      .mockResolvedValueOnce({ id: 11, status: STATUS.EM_TRANSITO })
      .mockResolvedValueOnce({ id: 11, status: STATUS.ENTREGUE });
    entregasRepository.atualizar.mockResolvedValue({ id: 11, status: STATUS.ENTREGUE });
    entregasRepository.criarEvento.mockResolvedValue(undefined);

    const result = await service.avancarStatus(11);

    expect(result.status).toBe(STATUS.ENTREGUE);
  });

  test('cancelarEntrega de CRIADA retorna sucesso', async () => {
    entregasRepository.buscarPorId.mockResolvedValue({ id: 14, status: STATUS.CRIADA });
    entregasRepository.atualizar.mockResolvedValue({ id: 14, status: STATUS.CANCELADA });
    entregasRepository.criarEvento.mockResolvedValue(undefined);

    const result = await service.cancelarEntrega(14);

    expect(result.status).toBe(STATUS.CANCELADA);
  });

  test('cancelarEntrega de ENTREGUE lança erro', async () => {
    entregasRepository.buscarPorId.mockResolvedValue({ id: 15, status: STATUS.ENTREGUE });

    await expect(service.cancelarEntrega(15)).rejects.toThrow('Não pode cancelar entrega finalizada');
  });
});
