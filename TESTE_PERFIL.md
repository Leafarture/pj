# 🧪 Guia de Teste - Sistema de Perfil Atualizado

## 📋 Checklist de Testes

### Pré-requisitos ✅
- [ ] Executar o script de migração do banco de dados: `sql/migration_add_user_fields.sql`
- [ ] Reiniciar a aplicação Spring Boot
- [ ] Limpar cache do navegador (ou abrir em aba anônima)

---

## 🔧 Teste 1: Novo Cadastro

### Passos:
1. Acesse a página de cadastro: `http://localhost:8080/Usuario.html?p=pf`
2. Preencha todos os campos:
   - Nome completo
   - E-mail
   - Telefone
   - CEP (teste com um CEP real, ex: `01310-100`)
   - Rua, Número, Complemento
   - Cidade, Estado
   - Senha
3. Clique em "Cadastrar"

### Resultado Esperado:
- ✅ Mensagem de sucesso aparece
- ✅ Redirecionamento para página de login
- ✅ Dados são salvos no banco de dados

### Como Verificar no Banco:
```sql
SELECT id_usuario, nome, email, rua, numero, cidade, estado, cep 
FROM usuario 
ORDER BY id_usuario DESC 
LIMIT 1;
```

---

## 👤 Teste 2: Login e Visualização do Perfil

### Passos:
1. Faça login com o usuário criado
2. Acesse o perfil: `http://localhost:8080/paginaUsuario.html`

### Resultado Esperado:
- ✅ Nome do usuário aparece no topo
- ✅ Seção **Contatos** mostra:
  - Email
  - Telefone
  - Data de cadastro
- ✅ Seção **Endereço** mostra:
  - Rua completa com número e complemento
  - Cidade
  - Localização (Cidade - Estado)
- ✅ Seção **Estatísticas** mostra:
  - Doações Realizadas: 0 (inicialmente)
  - Avaliação Média: 0.0 (inicialmente)
  - Dias Ativo: (calculado desde o cadastro)

---

## 📝 Teste 3: Edição de Perfil

### Passos:
1. Na página de perfil, clique no botão "Editar Perfil"
2. Altere alguns campos:
   - Nome
   - Descrição (campo de texto)
   - Endereço (rua)
   - Cidade
3. Clique em "Salvar Alterações"

### Resultado Esperado:
- ✅ Mensagem de sucesso aparece
- ✅ Modal fecha automaticamente
- ✅ Dados atualizados aparecem na página
- ✅ Ao recarregar a página, as alterações permanecem

### Como Verificar no Banco:
```sql
SELECT nome, descricao, rua, cidade 
FROM usuario 
WHERE email = 'seu_email@exemplo.com';
```

---

## 🎁 Teste 4: Criar Doação e Verificar Estatísticas

### Passos:
1. Acesse `http://localhost:8080/cadastro_alimento.html`
2. Crie uma nova doação:
   - Título: "Teste de Doação"
   - Descrição: "Testando sistema de estatísticas"
   - Tipo de Alimento: "Frutas"
   - Quantidade: 5
   - Cidade: (mesma do seu cadastro)
3. Clique em "Cadastrar Doação"
4. Volte para a página de perfil

### Resultado Esperado:
- ✅ Seção **Histórico de Doações** mostra a doação criada
- ✅ Seção **Estatísticas** mostra:
  - Doações Realizadas: 1
  - Avaliação Média: 0.0 (ainda não tem avaliações)

### Como Verificar no Banco:
```sql
-- Verificar doações do usuário
SELECT d.titulo, d.descricao, d.criado_em, d.ativo
FROM doacao d
JOIN usuario u ON d.id_doador = u.id_usuario
WHERE u.email = 'seu_email@exemplo.com';

-- Verificar contagem
SELECT COUNT(*) as total_doacoes
FROM doacao d
JOIN usuario u ON d.id_doador = u.id_usuario
WHERE u.email = 'seu_email@exemplo.com';
```

---

## 🔄 Teste 5: API Endpoints

### Teste GET /api/user/me
```bash
# Substitua SEU_TOKEN pelo token JWT obtido no login
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado Esperado**:
```json
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "telefone": "(11) 99999-9999",
  "tipoUsuario": "INDIVIDUAL",
  "statusAtivo": true,
  "verificado": false,
  "dataCadastro": "2025-10-25T10:30:00",
  "rua": "Rua Teste",
  "numero": "123",
  "complemento": "Apto 45",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310-100",
  "descricao": "Minha descrição",
  "avatarUrl": null
}
```

### Teste GET /api/user/me/stats
```bash
curl -X GET http://localhost:8080/api/user/me/stats \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado Esperado**:
```json
{
  "totalDonations": 1,
  "familiesHelped": 1,
  "averageRating": 0.0
}
```

### Teste PUT /api/user/me
```bash
curl -X PUT http://localhost:8080/api/user/me \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nome Atualizado",
    "descricao": "Nova descrição do perfil",
    "cidade": "Rio de Janeiro",
    "estado": "RJ"
  }'
```

**Resultado Esperado**:
```json
{
  "id": 1,
  "nome": "Nome Atualizado",
  "email": "usuario@exemplo.com",
  ...
  "descricao": "Nova descrição do perfil",
  "cidade": "Rio de Janeiro",
  "estado": "RJ"
}
```

---

## 🐛 Teste 6: Usuários Antigos (sem endereço)

### Cenário:
Teste com um usuário cadastrado ANTES das alterações (sem dados de endereço).

### Resultado Esperado:
- ✅ Página de perfil carrega normalmente
- ✅ Campos de endereço mostram "Não informado"
- ✅ Usuário pode editar o perfil e adicionar endereço
- ✅ Após salvar, endereço aparece corretamente

---

## 📊 Console do Navegador

### Verificações no Console (F12):
```javascript
// 1. Verificar autenticação
window.authManager.isAuthenticated()
// Deve retornar: true

// 2. Verificar dados do usuário
window.authManager.getCurrentUser()
// Deve retornar objeto com todos os campos incluindo endereço

// 3. Verificar ProfileManager
window.profileManager.currentUser
// Deve retornar objeto com dados completos do usuário

// 4. Verificar estatísticas
window.profileManager.userStats
// Deve retornar: { totalDonations: X, averageRating: Y, daysActive: Z }
```

---

## ✅ Checklist Final

### Backend:
- [ ] Modelo Usuario possui todos os novos campos
- [ ] UsuarioService salva dados de endereço no cadastro
- [ ] UserController retorna todos os campos na API
- [ ] Métodos de estatísticas retornam valores reais
- [ ] Repositories possuem queries para contar doações e avaliações

### Frontend:
- [ ] Página de perfil exibe endereço completo
- [ ] Página de perfil exibe descrição
- [ ] Estatísticas são buscadas da API
- [ ] Modal de edição permite atualizar todos os campos
- [ ] Alterações são salvas e persistem após reload

### Banco de Dados:
- [ ] Tabela usuario possui todas as novas colunas
- [ ] Índices foram criados para otimização
- [ ] Dados são salvos corretamente

---

## 🚨 Problemas Comuns

### Erro: "Column 'rua' not found"
**Solução**: Execute o script de migração SQL.

### Erro: "Cannot read property of null"
**Solução**: Limpe o cache do navegador e faça logout/login novamente.

### Estatísticas mostram 0
**Solução**: Certifique-se de que:
1. Você criou pelo menos uma doação
2. A doação está ativa
3. A doação está vinculada ao seu usuário

### Endereço não aparece
**Solução**: 
1. Verifique se o usuário foi cadastrado DEPOIS das alterações
2. Ou edite o perfil e adicione o endereço manualmente

---

## 📞 Suporte

Se encontrar algum problema:
1. Verifique o console do navegador (F12)
2. Verifique os logs do Spring Boot
3. Verifique se a migração do banco foi executada corretamente
4. Consulte o arquivo `ALTERACOES_PERFIL.md` para mais detalhes técnicos

---

**Última atualização**: 25/10/2025

