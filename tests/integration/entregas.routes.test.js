const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../../server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Testes de segurança de endpoints de entregas', () => {
  beforeEach(async () => {
    await prisma.eventoEntrega.deleteMany();
    await prisma.entrega.deleteMany();
    await prisma.motorista.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const buildToken = (payload, options = {}) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'segredo', {
      expiresIn: options.expiresIn || '8h'
    });
  };

  const criarUsuario = async (papel, email) => {
    return await prisma.user.create({
      data: {
        nome: `${papel} Teste`,
        email,
        senha: await bcrypt.hash('12345678', 10),
        papel
      }
    });
  };

  test('requisição sem token retorna 401', async () => {
    const response = await request(app).get('/api/entregas');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('erro');
  });

  test('requisição com token de assinatura inválida retorna 401', async () => {
    const response = await request(app)
      .get('/api/entregas')
      .set('Authorization', 'Bearer token-invalido');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('erro');
  });

  test('requisição com token expirado retorna 401 com mensagem contendo expirada', async () => {
    const usuario = await criarUsuario('OPERADOR', 'operador-expirado@teste.com');
    const tokenExpirado = jwt.sign(
      { sub: usuario.id, papel: 'OPERADOR' }, 
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: -1 }
    );

    const response = await request(app)
      .get('/api/entregas')
      .set('Authorization', `Bearer ${tokenExpirado}`);

    expect(response.status).toBe(401);
    expect(response.body.erro).toContain('expirado');
  });

  test('usuário com papel OPERADOR acessando rota exclusiva de GESTOR retorna 403', async () => {
    const usuario = await criarUsuario('OPERADOR', 'operador@teste.com');
    const token = buildToken({ id: usuario.id, nome: usuario.nome, email: usuario.email, papel: 'OPERADOR' });

    const response = await request(app)
      .get('/api/relatorios/entregas-por-status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('erro');
    expect(response.body.erro).toContain('gestor');
  });

  test('usuário OPERADOR tentando cancelar entrega retorna 403', async () => {
    const usuario = await criarUsuario('OPERADOR', 'operador-cancelar@teste.com');
    const entrega = await prisma.entrega.create({
      data: {
        descricao: 'Entrega teste',
        origem: 'Origem A',
        destino: 'Destino B',
        status: 'CRIADA',
        criadorId: usuario.id
      }
    });
    const token = buildToken({ id: usuario.id, nome: usuario.nome, email: usuario.email, papel: 'OPERADOR' });

    const response = await request(app)
      .patch(`/api/entregas/${entrega.id}/cancelar`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('erro');
    expect(response.body.erro).toContain('gestor');
  });
});
