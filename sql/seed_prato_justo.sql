-- Criar alguns usuarios e estabelecimentos para testes

INSERT INTO usuario (nome, email, senha_usuario, telefone, tipo_usuario, data_cadastro, status_ativo, verificado)
VALUES
('Alice Doe', 'alice@test.com', '$2a$10$Y0vQmW0nVhUum5m6n6oEYe7l9Vq4tq4ZK0b6g7m9O3wX3rQy5H4ce', '11999990001', 'INDIVIDUAL', NOW(), 1, 1),
('Bob ONG', 'bob@test.com', '$2a$10$Y0vQmW0nVhUum5m6n6oEYe7l9Vq4tq4ZK0b6g7m9O3wX3rQy5H4ce', '11999990002', 'ONG', NOW(), 1, 1);

-- senha bcrypt acima corresponde a: 123456

INSERT INTO estabelecimento (nome_estabelecimento, email, senha_estabelecimento, cnpj, telefone, endereco_completo, latitude, longitude, id_usuario)
VALUES
('Mercado Bom', 'mercado@test.com', '$2a$10$Y0vQmW0nVhUum5m6n6oEYe7l9Vq4tq4ZK0b6g7m9O3wX3rQy5H4ce', '12.345.678/0001-99', '1133334444', 'Rua Central, 100 - São Paulo', -23.5505, -46.6333, 1);

-- Doacoes iniciais
INSERT INTO doacao (id_doador, id_estabelecimento, titulo, descricao, tipo_alimento, quantidade, cidade, endereco, latitude, longitude, criado_em, ativo)
VALUES
(1, NULL, 'Pães do dia', 'Pães frescos restantes', 'Padaria', 20, 'São Paulo', 'Rua Central, 100', -23.55, -46.63, NOW(), 1),
(NULL, 1, 'Legumes variados', 'Cesta com legumes', 'Hortifruti', 10, 'São Paulo', 'Rua Central, 100', -23.55, -46.63, NOW(), 1);


