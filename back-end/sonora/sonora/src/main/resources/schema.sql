CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS musica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    artista VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    duracao INT DEFAULT 0,
    genero VARCHAR(100),
    favorita BOOLEAN DEFAULT FALSE,
    capa TEXT,
    usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id)
            REFERENCES usuario(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS anotacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    musica_id INT NOT NULL,
        FOREIGN KEY (musica_id)
            REFERENCES musica(id) ON DELETE CASCADE
);

