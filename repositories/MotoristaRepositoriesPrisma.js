const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MotoristasRepositoryPrisma {

  async listarTodos(filtros = {}) {
    const { status, page = 1, limit = 10 } = filtros;
    const limitFinal = Math.min(parseInt(limit, 10) || 10, 50);
    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (currentPage - 1) * limitFinal;

    const where = {};
    if (status) {
      where.status = status;
    }

    const total = await prisma.motorista.count({ where });
    const data = await prisma.motorista.findMany({
      where,
      skip,
      take: limitFinal,
      orderBy: { createdAt: "desc" }
    });

    return {
      data,
      total,
      page: currentPage,
      limit: limitFinal,
      totalPages: Math.ceil(total / limitFinal)
    };
  }

  async buscarPorId(id) {
    return await prisma.motorista.findUnique({
      where: { id: parseInt(id) },
      include: { entregas: true }
    });
  }

  async buscarPorCPF(cpf) {
    return await prisma.motorista.findUnique({
      where: { cpf },
      include: { entregas: true }
    });
  }

  async criar(dados) {
    return await prisma.motorista.create({
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo,
        status: dados.status || "ATIVO"
      }
    });
  }

  async atualizar(id, dados) {
    return await prisma.motorista.update({
      where: { id: parseInt(id) },
      data: {
        nome: dados.nome,
        cpf: dados.cpf,
        placaVeiculo: dados.placaVeiculo,
        status: dados.status
      }
    });
  }

  async deletar(id) {
    return await prisma.motorista.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = MotoristasRepositoryPrisma;
