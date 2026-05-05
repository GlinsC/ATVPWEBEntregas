const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MotoristasRepositoryPrisma {

  async listarTodos() {
    return await prisma.motorista.findMany({
      include: { entregas: true },
      orderBy: { createdAt: "desc" }
    });
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
