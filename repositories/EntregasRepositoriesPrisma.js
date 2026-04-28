const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class EntregasRepositoryPrisma {
  
  // Listar com filtros, paginação e intervalo de datas
  async listarTodos(filtros = {}) {
    const { status, page = 1, limit = 10, createdDe, createdAte, motoristaId } = filtros;
    
    // Validar limit máximo (50)
    const limitFinal = Math.min(parseInt(limit) || 10, 50);
    const skip = (parseInt(page) - 1) * limitFinal;
    
    // Construir where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (motoristaId) {
      where.motoristaId = parseInt(motoristaId);
    }
    
    // Intervalo de datas
    if (createdDe || createdAte) {
      where.createdAt = {};
      if (createdDe) {
        where.createdAt.gte = new Date(createdDe);
      }
      if (createdAte) {
        // Adicionar um dia para incluir o dia inteiro
        const dataAte = new Date(createdAte);
        dataAte.setDate(dataAte.getDate() + 1);
        where.createdAt.lt = dataAte;
      }
    }
    
    // Buscar total para paginação
    const total = await prisma.entrega.count({ where });
    
    // Buscar entregas com include de motorista e eventos
    const data = await prisma.entrega.findMany({
      where,
      include: {
        motorista: true,
        eventos: { orderBy: { data: "asc" } }
      },
      skip,
      take: limitFinal,
      orderBy: { createdAt: "desc" }
    });
    
    return {
      data,
      total,
      page: parseInt(page) || 1,
      limit: limitFinal,
      totalPages: Math.ceil(total / limitFinal)
    };
  }

  // Buscar por ID com histórico
  async buscarPorId(id) {
    return await prisma.entrega.findUnique({
      where: { id: parseInt(id) },
      include: {
        motorista: true,
        eventos: { orderBy: { data: "asc" } }
      }
    });
  }

  // Criar entrega
  async criar(dados) {
    return await prisma.entrega.create({
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status || "CRIADA",
        motoristaId: dados.motoristaId || null
      },
      include: { motorista: true, eventos: true }
    });
  }

  // Atualizar entrega
  async atualizar(id, dados) {
    return await prisma.entrega.update({
      where: { id: parseInt(id) },
      data: {
        descricao: dados.descricao,
        origem: dados.origem,
        destino: dados.destino,
        status: dados.status,
        motoristaId: dados.motoristaId
      },
      include: { motorista: true, eventos: true }
    });
  }

  // Deletar entrega
  async deletar(id) {
    return await prisma.entrega.delete({
      where: { id: parseInt(id) }
    });
  }

  // Criar evento (histórico)
  async criarEvento(entregaId, descricao) {
    return await prisma.eventoEntrega.create({
      data: {
        entregaId: parseInt(entregaId),
        descricao
      }
    });
  }

  // Listar histórico de uma entrega
  async listarHistorico(entregaId) {
    return await prisma.eventoEntrega.findMany({
      where: { entregaId: parseInt(entregaId) },
      orderBy: { data: "asc" }
    });
  }
}

module.exports = EntregasRepositoryPrisma;
