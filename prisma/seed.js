const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.eventoEntrega.deleteMany();
  await prisma.entrega.deleteMany();
  await prisma.motorista.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Banco limpo");

  const senhaPadrao = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      { nome: "Gestor Demo", email: "gestor@demo.com", senha: senhaPadrao, papel: "GESTOR" },
      { nome: "Operador Demo", email: "operador@demo.com", senha: senhaPadrao, papel: "OPERADOR" }
    ]
  });

  console.log("✓ Usuários de exemplo criados");

  // Criar motoristas
  const motorista1 = await prisma.motorista.create({
    data: {
      nome: "João Silva",
      cpf: "12345678901",
      placaVeiculo: "ABC1234",
      status: "ATIVO"
    }
  });

  const motorista2 = await prisma.motorista.create({
    data: {
      nome: "Maria Santos",
      cpf: "98765432101",
      placaVeiculo: "XYZ5678",
      status: "ATIVO"
    }
  });

  const motorista3 = await prisma.motorista.create({
    data: {
      nome: "Pedro Costa",
      cpf: "55555555555",
      placaVeiculo: "DEF9999",
      status: "ATIVO"
    }
  });

  console.log("✓ 3 motoristas criados");

  // Criar 10 entregas com diferentes status
  const entregas = [];
  for (let i = 1; i <= 10; i++) {
    const motoristaId = i <= 6 ? [motorista1.id, motorista2.id, motorista3.id][(i - 1) % 3] : null;
    
    const entrega = await prisma.entrega.create({
      data: {
        descricao: `Entrega ${i} - Produto eletrônico`,
        origem: `Cidade ${String.fromCharCode(64 + ((i - 1) % 5) + 1)}`,
        destino: `Cidade ${String.fromCharCode(64 + (i % 5) + 1)}`,
        status: i <= 3 ? "CRIADA" : i <= 6 ? "EM_TRANSITO" : i <= 9 ? "ENTREGUE" : "CANCELADA",
        motoristaId: motoristaId
      }
    });
    entregas.push(entrega);
  }

  console.log("✓ 10 entregas criadas");

  // Criar histórico (eventos) para cada entrega
  for (const entrega of entregas) {
    await prisma.eventoEntrega.create({
      data: {
        entregaId: entrega.id,
        descricao: "Entrega criada no sistema"
      }
    });

    if (entrega.status !== "CRIADA") {
      await prisma.eventoEntrega.create({
        data: {
          entregaId: entrega.id,
          descricao: "Entrega aceita pelo motorista"
        }
      });
    }

    if (entrega.status === "EM_TRANSITO") {
      await prisma.eventoEntrega.create({
        data: {
          entregaId: entrega.id,
          descricao: "Entrega em trânsito"
        }
      });
    }

    if (entrega.status === "ENTREGUE") {
      await prisma.eventoEntrega.create({
        data: {
          entregaId: entrega.id,
          descricao: "Entrega em trânsito"
        }
      });

      await prisma.eventoEntrega.create({
        data: {
          entregaId: entrega.id,
          descricao: "Entrega finalizada com sucesso"
        }
      });
    }

    if (entrega.status === "CANCELADA") {
      await prisma.eventoEntrega.create({
        data: {
          entregaId: entrega.id,
          descricao: "Entrega cancelada por motivo de força maior"
        }
      });
    }
  }

  console.log("✓ Histórico de eventos criado");
  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch(e => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
