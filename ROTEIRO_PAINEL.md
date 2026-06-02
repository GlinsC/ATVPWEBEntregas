# Roteiro de uso do painel (sem Postman)

Este roteiro cobre o fluxo completo do sistema usando apenas a interface web.

## 1. Preparar o ambiente
1. Instale as dependências:
   npm install
2. Aplique as migrações do Prisma:
   npx prisma migrate deploy
3. Popule os dados iniciais:
   npm run seed
4. Inicie o servidor:
   npm start
5. Abra no navegador:
   http://localhost:3000/login

## 2. Fazer login na interface
Use uma das contas de exemplo criadas pelo seed:
- Gestor: gestor@demo.com / 123456
- Operador: operador@demo.com / 123456

Faça login na tela /login e confirme que o sistema redireciona para o painel.

## 3. Fluxo de entregas no painel
### 3.1 Listar e filtrar
1. Acesse /painel/entregas.
2. Use o filtro de status para visualizar entregas por categoria.
3. Confirme que a tabela é carregada corretamente.

### 3.2 Criar uma entrega
1. Preencha Descrição, Origem e Destino.
2. Clique em "Criar entrega".
3. Verifique se a nova entrega aparece na tabela.

### 3.3 Abrir detalhes da entrega
1. Clique em "Detalhes" na linha da entrega desejada.
2. Confirme que a página de detalhes abre com:
   - status
   - motorista
   - histórico de eventos

### 3.4 Avançar status
1. Na página de detalhes, clique em "Avançar status".
2. Verifique se o status muda e se o histórico recebe um novo evento.

### 3.5 Atribuir motorista
1. Na página de detalhes, informe o ID de um motorista válido.
2. Clique em "Atribuir".
3. Confirme que a entrega passa a exibir o motorista atribuído.

### 3.6 Cancelar entrega
1. Abra uma entrega que ainda não esteja ENTREGUE ou CANCELADA.
2. Clique em "Cancelar entrega".
3. Confirme que o status muda para CANCELADA.

## 4. Fluxo de motoristas no painel
1. Acesse /painel/motorista.
2. Use o filtro por status para visualizar motoristas ativos/inativos.
3. Crie um novo motorista com nome, CPF e placa.
4. Verifique a nova linha na tabela.
5. Clique em "Detalhes" para ver as entregas atribuídas.
6. Use o botão "Ativar/Desativar" para alternar o status.

## 5. Validar relatórios no painel
1. Acesse os links de relatório disponíveis no painel.
2. Confirme que a tela exibe os dados consolidados de entregas e motoristas ativos.

## 6. Validar regras de permissão (RBAC)
### Como gestor
1. Faça login com gestor@demo.com.
2. Confirme que consegue:
   - cancelar entregas
   - criar motoristas
   - acessar relatórios

### Como operador
1. Faça login com operador@demo.com.
2. Tente realizar uma ação restrita a gestor.
3. Confirme que o sistema bloqueia a ação com mensagem de acesso negado.

## 7. Checklist final
- [ ] Login funciona
- [ ] Token é mantido na sessão
- [ ] Entregas criam, listam e detalham
- [ ] Status avança corretamente
- [ ] Motoristas criam e alternam status
- [ ] Relatórios são exibidos
- [ ] Permissões de gestor/operador funcionam
