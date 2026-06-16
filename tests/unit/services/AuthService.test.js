const AuthService = require('../../../services/AuthService');

describe('AuthService (unitário)', () => {
  let userService;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = {
      autenticar: jest.fn(),
      criarUsuario: jest.fn(),
    };
    service = new AuthService(userService);
  });

  test('login com e-mail inexistente lança erro 401', async () => {
    userService.autenticar.mockRejectedValue(new Error('Email ou senha inválidos'));

    await expect(service.login('naoexiste@test.com', '123456')).rejects.toThrow('Email ou senha inválidos');
  });

  test('login com senha incorreta lança erro 401', async () => {
    userService.autenticar.mockRejectedValue(new Error('Email ou senha inválidos'));

    await expect(service.login('usuario@test.com', 'errada')).rejects.toThrow('Email ou senha inválidos');
  });

  test('login bem-sucedido retorna token e usuário', async () => {
    userService.autenticar.mockResolvedValue({
      id: 1,
      nome: 'João',
      email: 'joao@test.com',
      papel: 'OPERADOR',
    });

    const result = await service.login('joao@test.com', '123456');

    expect(result.token).toBeTruthy();
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.usuario.email).toBe('joao@test.com');
  });

  test('login bem-sucedido não expõe a senha no retorno', async () => {
    userService.autenticar.mockResolvedValue({
      id: 2,
      nome: 'Maria',
      email: 'maria@test.com',
      papel: 'GESTOR',
      senha: 'hash-secreto',
    });

    const result = await service.login('maria@test.com', '123456');

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.usuario).not.toHaveProperty('senha');
  });

  test('registro com e-mail já cadastrado lança erro e não chama repository.criar', async () => {
    userService.criarUsuario.mockRejectedValue(new Error('Email já cadastrado'));

    await expect(service.register({ email: 'ja@existe.com', senha: '123456' })).rejects.toThrow('Email já cadastrado');
  });

  test('registro bem-sucedido chama o repository via injeção do construtor', async () => {
    userService.criarUsuario.mockResolvedValue({ id: 3, email: 'novo@test.com' });

    await service.register({ nome: 'Novo', email: 'novo@test.com', senha: '123456' });

    expect(userService.criarUsuario).toHaveBeenCalledWith({
      nome: 'Novo',
      email: 'novo@test.com',
      senha: '123456',
    });
  });
});
