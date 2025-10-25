# 🔧 Alterações no Sistema de Perfil - Prato Justo

## 📋 Resumo
Este documento descreve todas as alterações implementadas para corrigir o sistema de perfil, permitindo que dados de endereço, estatísticas e descrição sejam salvos e exibidos corretamente.

---

## ✅ Problema Identificado

### O que funcionava:
- ✅ **Doações**: Eram salvas e exibidas corretamente porque tinham endpoint `/doacoes/minhas` implementado

### O que NÃO funcionava:
- ❌ **Endereço**: Campos não existiam no modelo `Usuario`
- ❌ **Estatísticas**: Métodos retornavam valores fixos (0 ou 4.5)
- ❌ **Descrição**: Campo não existia no modelo `Usuario`
- ❌ **Avatar**: Campo não existia no modelo `Usuario`

---

## 🛠️ Alterações Implementadas

### 1. **Modelo Usuario.java** ✅
**Arquivo**: `src/main/java/com/TCC/Prato_Justo/Model/Usuario.java`

**Campos adicionados**:
```java
// Campos de endereço
@Column(name = "rua", length = 255)
private String rua;

@Column(name = "numero", length = 10)
private String numero;

@Column(name = "complemento", length = 100)
private String complemento;

@Column(name = "cidade", length = 100)
private String cidade;

@Column(name = "estado", length = 2)
private String estado;

@Column(name = "cep", length = 9)
private String cep;

// Campos adicionais de perfil
@Column(name = "descricao", columnDefinition = "TEXT")
private String descricao;

@Column(name = "avatar_url", length = 255)
private String avatarUrl;
```

**Getters e Setters**: Adicionados para todos os novos campos.

---

### 2. **UsuarioService.java** ✅
**Arquivo**: `src/main/java/com/TCC/Prato_Justo/Service/UsuarioService.java`

#### a) Importações adicionadas:
```java
import com.TCC.Prato_Justo.Interface.DoacaoRepository;
import com.TCC.Prato_Justo.Interface.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
```

#### b) Repositories injetados:
```java
@Autowired
private DoacaoRepository doacaoRepository;

@Autowired
private AvaliacaoRepository avaliacaoRepository;
```

#### c) Método `cadastrarNovoUsuario()` atualizado:
Agora salva os dados de endereço:
```java
// Salvar dados de endereço
cadastro.setRua(request.getRua());
cadastro.setNumero(request.getNumero());
cadastro.setComplemento(request.getComplemento());
cadastro.setCidade(request.getCidade());
cadastro.setEstado(request.getEstado());
cadastro.setCep(request.getCep());
```

#### d) Métodos de estatísticas implementados:
```java
public int getTotalDonations(Long userId) {
    return doacaoRepository.countByDoadorId(userId);
}

public int getFamiliesHelped(Long userId) {
    return doacaoRepository.countActiveByDoadorId(userId);
}

public double getAverageRating(Long userId) {
    Double average = avaliacaoRepository.getAverageRatingByUserId(userId);
    return average != null ? average : 0.0;
}
```

---

### 3. **UserController.java** ✅
**Arquivo**: `src/main/java/com/TCC/Prato_Justo/Controller/UserController.java`

#### a) Endpoint GET `/api/user/me` atualizado:
Agora retorna os novos campos:
```java
// Campos de endereço
userData.put("rua", usuario.getRua());
userData.put("numero", usuario.getNumero());
userData.put("complemento", usuario.getComplemento());
userData.put("cidade", usuario.getCidade());
userData.put("estado", usuario.getEstado());
userData.put("cep", usuario.getCep());

// Campos adicionais
userData.put("descricao", usuario.getDescricao());
userData.put("avatarUrl", usuario.getAvatarUrl());
```

#### b) Endpoint PUT `/api/user/me` atualizado:
Agora aceita e salva os novos campos:
```java
// Atualizar campos de endereço
if (updateData.containsKey("rua")) {
    usuario.setRua((String) updateData.get("rua"));
}
// ... (todos os outros campos de endereço)

// Atualizar campos adicionais
if (updateData.containsKey("descricao")) {
    usuario.setDescricao((String) updateData.get("descricao"));
}
if (updateData.containsKey("avatarUrl")) {
    usuario.setAvatarUrl((String) updateData.get("avatarUrl"));
}
```

---

### 4. **DoacaoRepository.java** ✅
**Arquivo**: `src/main/java/com/TCC/Prato_Justo/Interface/DoacaoRepository.java`

**Métodos adicionados**:
```java
// Contar doações por usuário
@Query("SELECT COUNT(d) FROM Doacao d WHERE d.doador.id = :usuarioId")
int countByDoadorId(@Param("usuarioId") Long usuarioId);

// Contar doações ativas por usuário
@Query("SELECT COUNT(d) FROM Doacao d WHERE d.doador.id = :usuarioId AND d.ativo = true")
int countActiveByDoadorId(@Param("usuarioId") Long usuarioId);
```

---

### 5. **AvaliacaoRepository.java** ✅
**Arquivo**: `src/main/java/com/TCC/Prato_Justo/Interface/AvaliacaoRepository.java`

**Métodos adicionados**:
```java
// Buscar avaliações de doações de um usuário específico
@Query("SELECT AVG(a.nota) FROM Avaliacao a JOIN a.estabelecimento e JOIN e.usuario u WHERE u.id = :usuarioId")
Double getAverageRatingByUserId(@Param("usuarioId") Long usuarioId);

// Contar avaliações recebidas por um usuário
@Query("SELECT COUNT(a) FROM Avaliacao a JOIN a.estabelecimento e JOIN e.usuario u WHERE u.id = :usuarioId")
int countByUserId(@Param("usuarioId") Long usuarioId);
```

---

### 6. **paginaUsuario.js (Frontend)** ✅
**Arquivo**: `src/main/resources/static/paginaUsuario.js`

#### a) Método `updateProfileDisplay()` atualizado:
Agora exibe os dados de endereço corretamente:
```javascript
// Endereço
const enderecoCompleto = this.currentUser.rua ? 
    `${this.currentUser.rua}${this.currentUser.numero ? ', ' + this.currentUser.numero : ''}${this.currentUser.complemento ? ' - ' + this.currentUser.complemento : ''}` : 
    'Não informado';
document.getElementById('address-text').textContent = enderecoCompleto;
document.getElementById('city-text').textContent = this.currentUser.cidade || 'Não informado';

const localizacao = (this.currentUser.cidade && this.currentUser.estado) ? 
    `${this.currentUser.cidade} - ${this.currentUser.estado}` : 
    (this.currentUser.cidade || this.currentUser.estado || 'Não informado');
document.getElementById('location-text').textContent = localizacao;

// Descrição
document.getElementById('description-text').textContent = this.currentUser.descricao || 'Não informado';
```

#### b) Método `calculateUserStats()` atualizado:
Agora busca estatísticas reais da API:
```javascript
async calculateUserStats() {
    try {
        if (window.authManager && window.authManager.isAuthenticated()) {
            const token = window.authManager.getToken();
            const response = await fetch('/api/user/me/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const stats = await response.json();
                this.userStats.totalDonations = stats.totalDonations || 0;
                this.userStats.averageRating = stats.averageRating || 0.0;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
    this.updateStatsDisplay();
}
```

#### c) Método `init()` atualizado:
Agora usa `await` para garantir carregamento sequencial:
```javascript
async init() {
    await this.loadUserData();
    this.setupEventListeners();
    await this.loadUserDonations();
    await this.loadUserRatings();
    await this.calculateUserStats();
}
```

#### d) Métodos `populateEditForm()` e `saveProfile()` atualizados:
Agora trabalham corretamente com os campos de endereço.

---

## 🗄️ Migrações de Banco de Dados Necessárias

**IMPORTANTE**: Você precisa executar uma migração no banco de dados para adicionar as novas colunas na tabela `usuario`:

```sql
ALTER TABLE usuario 
ADD COLUMN rua VARCHAR(255),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(100),
ADD COLUMN cidade VARCHAR(100),
ADD COLUMN estado VARCHAR(2),
ADD COLUMN cep VARCHAR(9),
ADD COLUMN descricao TEXT,
ADD COLUMN avatar_url VARCHAR(255);
```

---

## 🎯 Resultado Esperado

Após estas alterações:

### ✅ O que agora funciona:
1. **Cadastro**: Salva todos os campos de endereço (rua, número, complemento, cidade, estado, CEP)
2. **Perfil - Endereço**: Exibe endereço completo, cidade e localização
3. **Perfil - Descrição**: Exibe e permite editar a descrição do usuário
4. **Estatísticas**: Mostra número real de doações e avaliação média
5. **Edição de Perfil**: Permite atualizar todos os campos incluindo endereço

### 📊 Estatísticas agora calculadas:
- **Total de Doações**: Conta todas as doações do usuário
- **Famílias Ajudadas**: Conta doações ativas
- **Avaliação Média**: Calcula média real das avaliações recebidas

---

## 🚀 Como Testar

1. **Execute a migração SQL** no banco de dados
2. **Reinicie a aplicação** Spring Boot
3. **Faça um novo cadastro** com todos os dados de endereço
4. **Acesse o perfil** e verifique se os dados aparecem corretamente
5. **Crie uma doação** e verifique se as estatísticas são atualizadas
6. **Edite o perfil** e verifique se as alterações são salvas

---

## ⚠️ Observações

- Usuários cadastrados **antes** destas alterações não terão dados de endereço (aparecerá "Não informado")
- Para atualizar usuários existentes, eles precisam **editar o perfil** e preencher os campos
- As estatísticas de **avaliação** dependem de avaliações serem feitas através de estabelecimentos vinculados ao usuário

---

## 📝 Próximos Passos (Opcional)

1. Adicionar validação de CEP no backend
2. Implementar busca de endereço por CEP (integração com ViaCEP)
3. Adicionar campo de upload de avatar
4. Criar endpoint específico para buscar histórico completo de doações
5. Implementar sistema de avaliações diretas entre usuários

---

**Data**: 25/10/2025  
**Status**: ✅ Concluído

