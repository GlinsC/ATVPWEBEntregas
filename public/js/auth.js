window.handleLogin = async function (event) {
  event.preventDefault();

  const form = event.target;
  const payload = {
    email: form.email.value,
    senha: form.senha.value
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao fazer login');
    }

    localStorage.setItem('token', data.token);
    document.cookie = `token=${encodeURIComponent(data.token)}; Path=/; Max-Age=28800; SameSite=Lax`;
    window.location.href = '/painel/entregas';
  } catch (error) {
    window.location.href = '/login?error=' + encodeURIComponent(error.message);
  }
};

window.handleRegister = async function (event) {
  event.preventDefault();

  const form = event.target;
  const payload = {
    nome: form.nome.value,
    email: form.email.value,
    senha: form.senha.value
  };

  try {
    const response = await fetch('/api/auth/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao criar conta');
    }

    window.location.href = '/login?success=' + encodeURIComponent('Cadastro realizado com sucesso. Faça login.');
  } catch (error) {
    window.location.href = '/registrar?error=' + encodeURIComponent(error.message);
  }
};
