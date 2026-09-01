import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import estilos from "./Cadastro.module.css";
import Carregamento from "../componentes/Loading";
import { api } from "../api/api";

import pessoaDancando from "../assets/FotoCadastro.png";
import logo from "../assets/LogoBrancaSomenteNome.png";

function Cadastro() {
  const navegar = useNavigate();

  const [nomeCompleto, definirNomeCompleto] = useState("");
  const [usuario, definirUsuario] = useState("");
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(false);
  const [senhaVisivel, definirSenhaVisivel] = useState(false);

  async function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    // Verifica se todos os campos foram preenchidos
    if (!nomeCompleto || !usuario || !email || !senha) {
      definirErro("Preencha todos os campos.");
      return;
    }

    // Verifica o tamanho mínimo da senha
    if (senha.length < 6) {
      definirErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    definirCarregando(true);

    try {
      // Dados do usuário que serão enviados para a API
      const dadosUsuario = {
        nomeCompleto,
        usuario,
        email,
        senha
      };

      await api.cadastrarUsuario(dadosUsuario);

      // Após o cadastro, volta para a tela de login
      navegar("/");

    } catch (erroCadastro) {
      if (erroCadastro.message.includes("já cadastrado")) {
        definirErro("Usuário ou e-mail já cadastrado.");
      } else {
        definirErro("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      definirCarregando(false);
    }
  }

  function alterarUsuario(evento) {
    const valor = evento.target.value;

    // Permite apenas letras, números, espaços e ponto
    const usuarioFormatado = valor.replace(/[^a-zA-Z0-9\s.]/g, "");

    definirUsuario(usuarioFormatado);
  }

  function alternarVisibilidadeSenha() {
    definirSenhaVisivel(!senhaVisivel);
  }

  // Exibe a tela de carregamento enquanto o cadastro é processado
  if (carregando) {
    return <Carregamento />;
  }

  return (
    <main className={estilos.cadastro}>

      {/* ===== ÁREA VISUAL ===== */}

      <section className={estilos.visual}>
        <div className={estilos.formaRosa}></div>
        <div className={estilos.formaClara}></div>

        <img
          src={pessoaDancando}
          alt="Pessoa"
          className={estilos.pessoaDancando}
        />
      </section>


      {/* ===== ÁREA DO FORMULÁRIO ===== */}

      <section className={estilos.ladoFormulario}>

        <img
          src={logo}
          alt="Sonora"
          className={estilos.logo}
        />

        <div className={estilos.conteudoFormulario}>

          {/* ===== MENSAGEM DE BOAS-VINDAS ===== */}

          <div className={estilos.boasVindas}>
            <h1>Crie seu espaço.</h1>

            <p>
              <span>Guarde suas músicas.</span>
              <span>Viva suas memórias.</span>
            </p>
          </div>


          {/* ===== FORMULÁRIO DE CADASTRO ===== */}

          <form
            onSubmit={enviarFormulario}
            className={estilos.formulario}
          >

            {/* Nome completo */}
            <div className={estilos.campo}>
              <label htmlFor="nomeCompleto">
                Nome completo
              </label>

              <input
                id="nomeCompleto"
                type="text"
                value={nomeCompleto}
                onChange={(evento) =>
                  definirNomeCompleto(evento.target.value)
                }
                placeholder="Digite seu nome completo"
              />
            </div>


            {/* Nome de usuário */}
            <div className={estilos.campo}>
              <label htmlFor="usuario">
                Nome de usuário
              </label>

              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={alterarUsuario}
                placeholder="Digite seu nome de usuário"
              />
            </div>


            {/* E-mail */}
            <div className={estilos.campo}>
              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(evento) =>
                  definirEmail(evento.target.value)
                }
                placeholder="Digite seu e-mail"
              />
            </div>


            {/* Senha */}
            <div className={estilos.campo}>
              <label htmlFor="senha">
                Senha
              </label>

              <div className={estilos.containerSenha}>

                <input
                  id="senha"
                  type={senhaVisivel ? "text" : "password"}
                  value={senha}
                  onChange={(evento) =>
                    definirSenha(evento.target.value)
                  }
                  placeholder="Digite sua senha"
                />

                <button
                  type="button"
                  className={estilos.alternarSenha}
                  onClick={alternarVisibilidadeSenha}
                  aria-label={
                    senhaVisivel
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {senhaVisivel ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />

                      <line
                        x1="1"
                        y1="1"
                        x2="23"
                        y2="23"
                      />
                    </svg>
                  )}
                </button>

              </div>
            </div>


            {/* Mensagem de erro */}
            {erro && (
              <span className={estilos.erro}>
                {erro}
              </span>
            )}


            {/* Botão de cadastro */}
            <button
              type="submit"
              className={estilos.botao}
              disabled={carregando}
            >
              {carregando
                ? "Cadastrando..."
                : "Cadastrar"}
            </button>

          </form>


          {/* ===== LINK PARA LOGIN ===== */}

          <div className={estilos.loginLink}>
            <span>Já possui uma conta?</span>

            <Link to="/">
              Faça login
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Cadastro;
