const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const app = require("../server");
const prisma = new PrismaClient();

const createdEmails = [];

async function cleanup() {
  await prisma.user.deleteMany({
    where: { email: { in: createdEmails } }
  });
}

test("GET /login retorna a página de login", async () => {
  const response = await request(app).get("/login");

  assert.equal(response.status, 200);
  assert.match(response.text, /Login/i);
});

test("POST /api/auth/registrar e login retornam sucesso", async () => {
  const email = `smoke+${Date.now()}@mail.com`;
  createdEmails.push(email);

  const registerResponse = await request(app)
    .post("/api/auth/registrar")
    .send({ nome: "Usuário Smoke", email, senha: "123456" });

  assert.equal(registerResponse.status, 201);
  assert.equal(registerResponse.body.email, email);

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email, senha: "123456" });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);
  assert.equal(loginResponse.body.usuario.email, email);
});

test("GET /painel/entregas aceita token via cookie para navegação HTML", async () => {
  const email = `html+${Date.now()}@mail.com`;
  createdEmails.push(email);

  await request(app)
    .post("/api/auth/registrar")
    .send({ nome: "Usuário HTML", email, senha: "123456" });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email, senha: "123456" });

  const cookie = `token=${encodeURIComponent(loginResponse.body.token)}`;
  const response = await request(app)
    .get("/painel/entregas")
    .set("Cookie", cookie);

  assert.equal(response.status, 200);
  assert.match(response.text, /Painel de Entregas/i);
});

test("PATCH /api/usuarios/:id/papel exige autorização de GESTOR", async () => {
  const senhaHash = await bcrypt.hash("123456", 10);
  const operador = await prisma.user.create({
    data: {
      nome: "Operador Teste",
      email: `operador+${Date.now()}@mail.com`,
      senha: senhaHash,
      papel: "OPERADOR"
    }
  });

  const gestor = await prisma.user.create({
    data: {
      nome: "Gestor Teste",
      email: `gestor+${Date.now()}@mail.com`,
      senha: senhaHash,
      papel: "GESTOR"
    }
  });

  createdEmails.push(operador.email, gestor.email);

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: operador.email, senha: "123456" });

  assert.equal(loginResponse.status, 200);

  const patchResponse = await request(app)
    .patch(`/api/usuarios/${gestor.id}/papel`)
    .set("Authorization", `Bearer ${loginResponse.body.token}`)
    .send({ papel: "OPERADOR" });

  assert.equal(patchResponse.status, 403);
  assert.match(patchResponse.body.erro || "", /Acesso negado/i);
});

process.on("exit", async () => {
  await cleanup();
});
