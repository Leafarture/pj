# Sistema de Autenticação e Doações - Prato Justo

## Visão Geral

Este documento descreve o sistema de autenticação com JWT e gerenciamento de doações implementado no projeto Prato Justo.

## Funcionalidades Implementadas

### 1. Sistema de Autenticação JWT

- **Token JWT**: Autenticação stateless usando tokens JWT
- **Login/Logout**: Sistema completo de autenticação
- **Sessão Persistente**: Token armazenado no localStorage do navegador
- **Validação Automática**: Middleware que valida tokens em todas as requisições protegidas

### 2. Gerenciamento de Usuários

- **Identificação Única**: Cada usuário possui um ID único
- **Tipos de Usuário**: Suporte a usuários individuais e estabelecimentos
- **Dados Seguros**: Senhas criptografadas com BCrypt

### 3. Sistema de Doações

#### Para Usuários Logados:
- **Criar Doações**: Associadas automaticamente ao usuário logado
- **Ver Minhas Doações**: Página dedicada com estatísticas
- **Gerenciar Doações**: Editar e excluir próprias doações

#### Para Visitantes:
- **Visualizar Doações**: Acesso público às doações ativas
- **Filtros**: Por cidade e tipo de alimento
- **Interface Responsiva**: Design moderno e mobile-friendly

## Arquivos Implementados

### Backend (Java/Spring Boot)

#### Segurança
- `JwtUtil.java` - Utilitário para geração e validação de tokens JWT
- `JwtAuthenticationFilter.java` - Filtro para interceptar e validar tokens
- `CustomUserDetailsService.java` - Serviço personalizado para autenticação
- `SecurityConfig.java` - Configuração de segurança atualizada

#### Serviços
- `AuthService.java` - Serviço de autenticação
- `UsuarioService.java` - Atualizado com método findByEmail
- `DoacaoService.java` - Atualizado com método listarPorDoador

#### Controllers
- `AuthUsuarioController.java` - Atualizado para retornar JWT
- `UserController.java` - Endpoints para informações do usuário logado
- `DoacaoController.java` - Atualizado para associar doações ao usuário

#### Repositories
- `DoacaoRepository.java` - Adicionado método findByDoadorId

### Frontend (HTML/CSS/JavaScript)

#### Páginas
- `doacoes.html` - Página principal de doações (atualizada)
- `minhas-doacoes.html` - Página de doações do usuário logado (nova)
- `doacoes.css` - Estilos modernos e responsivos (atualizado)

#### Scripts
- `doacoes.js` - Sistema completo de visualização de doações (atualizado)
- `minhas-doacoes.js` - Gerenciamento de doações do usuário (novo)
- `login.js` - Armazenamento de token JWT (atualizado)
- `cadastro_alimento.js` - Autenticação automática (atualizado)

## Como Usar o Sistema

### 1. Login
```javascript
// O token é automaticamente armazenado no localStorage
localStorage.setItem('token', 'jwt-token-here');
```

### 2. Fazer uma Doação
1. Fazer login no sistema
2. Acessar "Fazer Doação" ou "Nova Doação"
3. Preencher o formulário
4. A doação será automaticamente associada ao usuário logado

### 3. Ver Minhas Doações
1. Fazer login no sistema
2. Acessar "Minhas Doações" no menu
3. Visualizar estatísticas e gerenciar doações

### 4. Navegar por Doações
1. Acessar a página de doações (público)
2. Usar filtros para encontrar doações específicas
3. Visualizar informações detalhadas de cada doação

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login (retorna JWT)
- `POST /auth/registro` - Registro de usuário
- `GET /api/user/me` - Informações do usuário logado

### Doações
- `GET /doacoes` - Listar doações públicas
- `POST /doacoes` - Criar doação (requer autenticação)
- `GET /doacoes/minhas` - Minhas doações (requer autenticação)
- `GET /doacoes/{id}` - Obter doação específica
- `PUT /doacoes/{id}` - Atualizar doação
- `DELETE /doacoes/{id}` - Excluir doação

## Configuração

### Dependências Adicionadas (pom.xml)
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

### Propriedades (application.properties)
```properties
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000
```

## Fluxo de Autenticação

1. **Login**: Usuário faz login com email/senha
2. **Token**: Sistema retorna JWT token
3. **Armazenamento**: Token é salvo no localStorage
4. **Requisições**: Token é enviado no header Authorization
5. **Validação**: Middleware valida token em cada requisição
6. **Contexto**: Usuário logado é disponibilizado no contexto de segurança

## Segurança

- **Tokens JWT**: Assinados e com expiração
- **Criptografia**: Senhas criptografadas com BCrypt
- **Validação**: Middleware automático de validação
- **Headers**: CORS configurado para requisições cross-origin
- **Stateless**: Sistema sem sessões server-side

## Funcionalidades do Frontend

### Interface Moderna
- Design responsivo com gradientes
- Cards animados com hover effects
- Ícones Font Awesome
- Loading states e mensagens de erro

### Filtros e Busca
- Filtro por cidade
- Filtro por tipo de alimento
- Busca em tempo real
- Limpeza de filtros

### Gerenciamento de Estado
- Verificação automática de autenticação
- Atualização dinâmica da interface
- Persistência de estado no localStorage
- Redirecionamentos inteligentes

## Próximos Passos

1. **Implementar edição de doações** no frontend
2. **Adicionar notificações** para doações próximas
3. **Sistema de avaliações** entre usuários
4. **Chat em tempo real** para comunicação
5. **Relatórios e analytics** de doações

## Testando o Sistema

1. Inicie a aplicação Spring Boot
2. Acesse `http://localhost:8080`
3. Faça login ou cadastre um novo usuário
4. Teste a criação de doações
5. Verifique a página "Minhas Doações"
6. Teste os filtros na página de doações públicas
