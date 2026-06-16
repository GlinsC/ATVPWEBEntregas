const request = require('supertest');
const app = require('../../server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Testes de integração de autenticação', () => {
  beforeEach(async () => {
    await prisma.eventoEntrega.deleteMany();
    await prisma.entrega.deleteMany();
    await prisma.motorista.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/registrar', () => {
    test('deve criar um novo usuário e retornar 201 sem o campo senha', async () => {
      const response = await request(app)
        .post('/api/auth/registrar')
        .send({ nome: 'Teste', email: 'teste@teste.com', senha: '12345678' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', 'Teste');
      expect(response.body).toHaveProperty('email', 'teste@teste.com');
      expect(response.body).not.toHaveProperty('senha');
    });

    test('deve retornar 400 quando a senha tiver menos de 8 caracteres', async () => {
      const response = await request(app)
        .post('/api/auth/registrar')
        .send({ nome: 'Teste', email: 'teste2@teste.com', senha: '1234567' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro', 'Senha deve ter pelo menos 8 caracteres');
    });

    test('deve retornar 409 quando o email já estiver cadastrado', async () => {
      await prisma.user.create({
        data: {
          nome: 'Existente',
          email: 'existente@teste.com',
          senha: await require('bcrypt').hash('12345678', 10)
        }
      });

      const response = await request(app)
        .post('/api/auth/registrar')
        .send({ nome: 'Teste', email: 'existente@teste.com', senha: '12345678' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('erro', 'Email já cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          nome: 'Usuário Login',
          email: 'login@teste.com',
          senha: await require('bcrypt').hash('12345678', 10)
        }
      });
    });

    test('deve retornar 200 com accessToken e refreshToken para credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@teste.com', senha: '12345678' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).toHaveProperty('email', 'login@teste.com');
    });

    test('deve retornar 401 quando a senha estiver incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@teste.com', senha: 'senhaerrada' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('erro', 'Credenciais inválidas');
    });

    test('deve retornar 401 quando o email não existir', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'naoexiste@teste.com', senha: '12345678' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('erro', 'Credenciais inválidas');
    });
  });
});
