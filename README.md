
## Base URL

```
http://localhost:3000/api
```

---

## Entregas

### POST /entregas

Cria uma nova entrega.

#### Body (JSON)

```json
{
  "descricao": "Notebook",
  "origem": "Maceió",
  "destino": "Recife"
}
```

#### Regras

* Origem e destino devem ser diferentes
* Não é permitido criar entregas duplicadas ativas

---

### GET /entregas

Lista todas as entregas.

#### Query Params (opcional)

```
/entregas?status=EM_TRANSITO
```

#### Descrição

* `status`: filtra entregas pelo status informado

---

### GET /entregas/:id

Busca uma entrega pelo ID.

#### Params

```
/entregas/1
```

---

### PATCH /entregas/:id/avancar

Avança o status da entrega.

#### Fluxo de status

```
CRIADA → EM_TRANSITO → ENTREGUE
```

#### Regras

* Não é permitido avançar após ENTREGUE ou CANCELADA
* Não é permitido pular etapas

---

### PATCH /entregas/:id/cancelar

Cancela uma entrega.

#### Regras

* Não é permitido cancelar entregas com status ENTREGUE

---

### PATCH /entregas/:id/atribuir

Atribui um motorista a uma entrega.

#### Body (JSON)

```json
{
  "motoristaId": 1
}
```

#### Regras

* A entrega deve estar com status CRIADA
* O motorista deve estar com status ATIVO
* Uma nova atribuição substitui a anterior

---

### GET /entregas/:id/historico

Retorna o histórico de eventos da entrega.

---

## Motoristas

### POST /motoristas

Cria um novo motorista.

#### Body (JSON)

```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "placaVeiculo": "ABC-1234"
}
```

#### Regras

* O CPF deve ser único

---

### GET /motoristas

Lista todos os motoristas cadastrados.

---

### GET /motoristas/:id

Busca um motorista pelo ID.

---

### GET /motoristas/:id/entregas

Lista todas as entregas atribuídas a um motorista.

#### Query Params (opcional)

```
/motoristas/1/entregas?status=CRIADA
```

#### Descrição

* `status`: permite combinar filtro por motorista e status

---

## Métodos HTTP

### GET

Utilizado para recuperação de dados.
Pode utilizar query parameters para filtragem.

Exemplo:

```
GET /entregas?status=CRIADA
```


### POST

Utilizado para criação de recursos.
Os dados são enviados no corpo da requisição.

Exemplo:

```
POST /motoristas
```

---

### PATCH

Utilizado para atualização parcial de recursos.

Exemplo:

```
PATCH /entregas/1/avancar
```

---

## Testes E2E

### Executar todos os testes Playwright

```bash
npm run test:e2e
```

### Executar apenas os novos testes de filtros e paginação

```bash
npx playwright test tests/e2e/entregas.filters.spec.js
```

### Observações

- O Playwright está configurado em `tests/e2e/playwright.config.js`.
- O resultado dos testes é exibido diretamente no terminal.
- O servidor é iniciado automaticamente quando o comando de teste roda.
- Os testes usam usuários criados dinamicamente para evitar conflito de dados.


## Estrutura de Requisição

### Params

Utilizados para identificar recursos específicos na URL.

Exemplo:

```
/entregas/1
```


### Query

Utilizados para filtragem de dados.

Exemplo:

```
/entregas?status=CRIADA
```


### Body

Utilizado para envio de dados na criação ou atualização.

Exemplo:

```json
{
  "nome": "João"
}

GET /api/entregas?page=1&limit=3
GET /api/entregas?status=ENTREGUE&page=1&limit=2
GET /api/entregas?createdDe=2026-04-01&createdAte=2026-04-27

## Testes

### Estratégia de testes adotada

- Unitários: validam a camada de serviços isolando dependências externas.
  - `tests/unit/services/AuthService.test.js`
  - `tests/unit/services/EntregasService.test.js`
  - `bcrypt`, `jsonwebtoken`, `prisma` e outras dependências do banco são substituídos por dublês.
- Integração: validam rotas e o servidor Express com banco de testes.
  - `tests/integration/auth.routes.test.js`
  - `tests/integration/entregas.routes.test.js`
- E2E: validam o fluxo fim a fim no navegador com Playwright.
  - `tests/e2e/login.spec.js`
  - `tests/e2e/entregas.spec.js`
  - Page Objects em `tests/e2e/pages/LoginPage.js` e `tests/e2e/pages/EntregasPage.js`

### Como executar cada camada

- Unitários:
  - `npm test -- tests/unit/services/AuthService.test.js tests/unit/services/EntregasService.test.js`
- Integração:
  - `npm test -- tests/integration/auth.routes.test.js tests/integration/entregas.routes.test.js`
- E2E:
  - `npm run test:e2e`
  - Antes de rodar, execute `npx playwright install` uma vez para baixar os browsers.
- Cobertura:
  - `npm run test:coverage`

### Análise de cobertura (RF-07)

A cobertura atual mostra pontos fortes e áreas que ainda precisam de atenção:

- `utils/`: 100% (atinge o limiar de 75%)
- `services/`: 46.75% (abaixo do limiar de 80%)
- `middlewares/`: 80.48% (abaixo do limiar de 85%)

#### Trechos com cobertura zero

1. `repositories/` (múltiplos arquivos de repositório)
   - Por que não está sendo testado: os testes atuais focam nas camadas de serviço e integração, mas não existem testes unitários diretos para as implementações de repositório.
   - Impacto de um bug: filtros SQL/Prisma ou mapeamento de dados incorretos podem falhar sem serem detectados, especialmente em consultas e alterações de entrega.
   - Vale a pena testar? Sim, se o repositório contiver lógica complexa de consulta ou transformação de dados. No caso atual, pode ser de prioridade secundária porque a integração já cobre parte desse comportamento.

2. `services/EntregasServices.js` (fluxos avançados de entrega)
   - Por que não está sendo testado: faltam casos de serviço para operações como atribuição de motorista, busca com filtros e atualização de status em caminhos menos comuns.
   - Impacto de um bug: regras de negócio de entregas podem ser quebradas, permitindo avanços inválidos ou cancelamento indevido.
   - Vale a pena testar? Sim, porque a camada de serviço aplica regras de negócio centrais e deve ser bem coberta para evitar regressões.

### Observações importantes

- Os testes unitários já passam mesmo com `DATABASE_URL` inválida, o que indica isolamento correto da camada de services.
- Como o projeto não possui um diretório `frontend/tests/e2e/`, os testes E2E foram implementados em `tests/e2e/` conforme a estrutura atual do repositório.
- A cobertura de RF-07 ainda precisa ser aprimorada para `services/` e `middlewares/`.
