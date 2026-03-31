
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

