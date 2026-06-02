const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserRepositoryPrisma {
  async buscarPorEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async buscarPorId(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }

  async criar(dados) {
    return await prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        papel: dados.papel || "OPERADOR"
      }
    });
  }

  async atualizarPapel(id, papel) {
    return await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { papel }
    });
  }
}

module.exports = UserRepositoryPrisma;
