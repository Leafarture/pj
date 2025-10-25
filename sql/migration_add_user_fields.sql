-- ==============================================================================
-- MIGRAÇÃO: Adicionar campos de endereço e perfil à tabela usuario
-- Data: 25/10/2025
-- Descrição: Adiciona campos para armazenar endereço completo, descrição e 
--            avatar do usuário
-- ==============================================================================

-- Adicionar campos de endereço
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS rua VARCHAR(255) NULL COMMENT 'Nome da rua',
ADD COLUMN IF NOT EXISTS numero VARCHAR(10) NULL COMMENT 'Número do endereço',
ADD COLUMN IF NOT EXISTS complemento VARCHAR(100) NULL COMMENT 'Complemento (apto, bloco, etc)',
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100) NULL COMMENT 'Cidade',
ADD COLUMN IF NOT EXISTS estado VARCHAR(2) NULL COMMENT 'Sigla do estado (UF)',
ADD COLUMN IF NOT EXISTS cep VARCHAR(9) NULL COMMENT 'CEP no formato 00000-000';

-- Adicionar campos adicionais de perfil
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS descricao TEXT NULL COMMENT 'Descrição/bio do usuário',
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) NULL COMMENT 'URL do avatar do usuário';

-- Criar índices para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_usuario_cidade ON usuario(cidade);
CREATE INDEX IF NOT EXISTS idx_usuario_estado ON usuario(estado);
CREATE INDEX IF NOT EXISTS idx_usuario_cep ON usuario(cep);

-- ==============================================================================
-- VERIFICAÇÃO
-- ==============================================================================
-- Execute o comando abaixo para verificar se as colunas foram criadas:
-- DESCRIBE usuario;

-- Ou para MySQL:
-- SHOW COLUMNS FROM usuario;

-- ==============================================================================
-- ROLLBACK (caso necessário)
-- ==============================================================================
-- ATENÇÃO: Execute apenas se precisar reverter as alterações!
/*
ALTER TABLE usuario 
DROP COLUMN IF EXISTS rua,
DROP COLUMN IF EXISTS numero,
DROP COLUMN IF EXISTS complemento,
DROP COLUMN IF EXISTS cidade,
DROP COLUMN IF EXISTS estado,
DROP COLUMN IF EXISTS cep,
DROP COLUMN IF EXISTS descricao,
DROP COLUMN IF EXISTS avatar_url;

DROP INDEX IF EXISTS idx_usuario_cidade ON usuario;
DROP INDEX IF EXISTS idx_usuario_estado ON usuario;
DROP INDEX IF EXISTS idx_usuario_cep ON usuario;
*/

