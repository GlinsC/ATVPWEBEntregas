// Repository = camada que conversa com o "banco"
// Ele NÃO deve ter regras de negócio

class EntregasRepository {
  constructor(database) {
    // Recebe o database via injeção de dependência
    this.database = database;
  }

  // Lista todas as entregas
  listarTodos() {
    return this.database.getEntregas();
  }

  // Busca uma entrega pelo ID
  buscarPorId(id) {
    return this.database.getEntregas().find(e => e.id === id);
  }

  // Cria uma nova entrega
criar(entrega) {
  // chama o database para gerar ID sequencial
  entrega.id = this.database.generateId();

  this.database.getEntregas().push(entrega);

  return entrega;
}

  // Atualiza uma entrega existente
  atualizar(id, dadosAtualizados) {
    const entregas = this.database.getEntregas();

    const index = entregas.findIndex(e => e.id === id);

    if (index === -1) return null;

    entregas[index] = dadosAtualizados;

    return dadosAtualizados;
  }
}



module.exports = EntregasRepository;