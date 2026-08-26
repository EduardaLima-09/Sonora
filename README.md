![Logo Sonora](./src/assets/LogoCompletaBranca.png)

# 🎵 Sonora

> **Onde cada música guarda uma história.**

O **Sonora** é um diário musical desenvolvido em **React**, criado para transformar músicas em memórias.

A proposta da aplicação é permitir que o usuário registre músicas que marcaram momentos importantes da sua vida, adicionando informações como título, artista, álbum, imagem e uma descrição sobre a memória relacionada àquela música.

Mais do que apenas cadastrar músicas, o Sonora busca criar um espaço pessoal para **guardar, organizar e revisitar histórias através da música**.

---

## ✨ Sobre o projeto

O Sonora nasceu da ideia de que algumas músicas são muito mais do que sons: elas estão relacionadas a pessoas, lugares, momentos e sentimentos.

Na plataforma, o usuário pode construir seu próprio diário musical, registrando as músicas que fazem parte da sua história.

A aplicação conta com uma interface simples, moderna e voltada para uma experiência visual relacionada ao universo da música.

---

## 🎧 Funcionalidades

* 🔐 **Login e cadastro de usuário**
* 🎵 **Cadastro de músicas**
* 📖 **Diário de músicas e memórias**
* 🔎 **Visualização das músicas cadastradas**
* ❤️ **Favoritar músicas**
* 🖼️ **Adicionar imagem às músicas**
* 🎤 **Artista em destaque**
* ✏️ **Editar músicas cadastradas**
* 🗑️ **Excluir músicas**
---

## 🏠 Página inicial

A Home apresenta um resumo da experiência musical do usuário, com informações como:

* Artista em destaque;
* Músicas favoritas;
* Quantidade de músicas cadastradas;
* Acesso rápido ao diário musical;
* Destaques do acervo pessoal.

---

## 📖 Diário Musical

O principal conceito do Sonora é o **diário de músicas**.

Cada música cadastrada pode representar uma lembrança ou momento especial. O usuário pode registrar informações sobre a música e escrever sobre o motivo pelo qual ela é importante para sua história.

> **Você não precisa apenas ouvir uma música para lembrá-la. No Sonora, você pode registrar o que ela significa.**

---

## 🛠️ Tecnologias utilizadas

### Front-end

* **React**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **CSS Modules**
* **React Router**

### Back-end

A aplicação é integrada a uma **API REST**, responsável pelo gerenciamento e persistência dos dados.

### Banco de dados

Os dados cadastrados pelo usuário são persistidos em banco de dados através da API.

---

## 🔗 Integração com API

O Sonora utiliza uma API REST para realizar as operações de cadastro e gerenciamento das músicas.

Entre as operações utilizadas estão:

| Método   | Operação          |
| -------- | ----------------- |
| `GET`    | Consultar músicas |
| `POST`   | Cadastrar música  |
| `PUT`    | Atualizar música  |
| `DELETE` | Excluir música    |

A aplicação não utiliza dados estáticos para representar as músicas cadastradas. As informações são obtidas e enviadas através da API.

---

## 📂 Estrutura do projeto

```text
sonora/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acesse a pasta do projeto

```bash
cd sonora
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute o projeto

```bash
npm run dev
```

Após executar o comando, o Vite disponibilizará a aplicação no endereço indicado pelo terminal.

---

## 🎨 Identidade

O Sonora possui uma identidade visual inspirada no universo musical, utilizando uma estética moderna e delicada para representar a relação entre **música, memória e sentimentos**.

### Slogan

> **Sonora — Onde cada música guarda uma história.**

---

## 🎯 Objetivo acadêmico

O Sonora foi desenvolvido como projeto acadêmico com o objetivo de aplicar conceitos de desenvolvimento **Front-end com React**, integração com **API REST**, gerenciamento de estados, componentização, roteamento e persistência de dados.

O projeto também busca demonstrar uma aplicação completa, desde a experiência do usuário até a comunicação com o back-end.

---

## 👩‍💻 Desenvolvido por

**Maria Eduarda Lima**

Projeto acadêmico — **Análise e Desenvolvimento de Sistemas**
