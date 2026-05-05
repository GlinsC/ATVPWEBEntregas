// Repository de motoristas
// Responsável apenas por persistência

class MotoristasRepository {
  constructor(database) {
    this.database = database;
    this.motoristas = []; // pode usar database também
    this.nextId = 1;
  }

  listarTodos() {
    return this.motoristas;
  }

  buscarPorId(id) {
    return this.motoristas.find(m => m.id === id);
  }

  buscarPorCPF(cpf) {
    return this.motoristas.find(m => m.cpf === cpf);
  }

  criar(dados) {
    const novoMotorista = {
      id: this.nextId++,
      ...dados
    };

    this.motoristas.push(novoMotorista);

    return novoMotorista;
  }

  atualizar(id, dados) {
    const index = this.motoristas.findIndex(m => m.id === id);

    if (index === -1) return null;

    this.motoristas[index] = dados;
    return dados;
  }
}

module.exports = MotoristasRepository;