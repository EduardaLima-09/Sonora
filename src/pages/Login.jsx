
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import estilos from "./Login.module.css";
import Carregamento from "../componentes/Loading";
import { api } from "../api/api";

import pessoaDancando from "../assets/FotoLogin.png";
import logo from "../assets/LogoBrancaSomenteNome.png";

function Login() {
  const navegar = useNavigate();

  const [usuario, definirUsuario] = useState("");
  const [senha, definirSenha] = useState("");
  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(false);
  const [senhaVisivel, definirSenhaVisivel] = useState(false);

  async function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    if (!usuario || !senha) {
      definirErro("Preencha todos os campos.");
      return;
    }

    definirCarregando(true);

    try {
      // Dados enviados para a API de login
      const dadosLogin = {
        usuario,
        senha
      };

      const usuarioLogado = await api.login(dadosLogin);

      // Salva os dados do usuário no navegador
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: usuarioLogado.id,
          nome: usuarioLogado.usuario,
          nomeCompleto: usuarioLogado.nomeCompleto,
          usuario: usuarioLogado.usuario
        })
      );

      // Redireciona para a página inicial
      navegar("/home");

    } catch (erroLogin) {
      definirErro(erroLogin.message || "Erro ao fazer login.");
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

  // Exibe a tela de carregamento enquanto o login é processado
  if (carregando) {
    return <Carregamento />;
  }

  return (
    <main className={estilos.login}>

      <section className={estilos.visual}>
        <div className={estilos.formaRosa}></div>
        <div className={estilos.formaClara}></div>

        <img
          src={pessoaDancando}
          alt="Pessoa dançando"
          className={estilos.pessoaDancando}
        />
      </section>

      <section className={estilos.ladoFormulario}>

        <img
          src={logo}
          alt="Sonora"
          className={estilos.logo}
        />

        <div className={estilos.conteudoFormulario}>

          <div className={estilos.boasVindas}>
            <h1>Bem-vindo de volta!</h1>

            <p>
              <span>
                Porque algumas lembranças têm uma trilha sonora
              </span>
            </p>
          </div>

          <form
            onSubmit={enviarFormulario}
            className={estilos.formulario}
          >

            {/* Campo de usuário */}
            <div className={estilos.campo}>
              <label htmlFor="usuario">
                Nome de usuário
              </label>

              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={alterarUsuario}
                placeholder="Digite seu usuário"
              />
            </div>

            {/* Campo de senha */}
            <div className={estilos.campo}>
              <label htmlFor="senha">
                Senha
              </label>

              <div className={estilos.containerSenha}>

                <input
                  id="senha"
                  type={senhaVisivel ? "text" : "password"}
                  value={senha}
                  onChange={(evento) => definirSenha(evento.target.value)}
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
                      <circle cx="12" cy="12" r="3" />
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

            {/* Botão de login */}
            <button
              type="submit"
              className={estilos.botao}
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

          </form>

          {/* Cadastro */}
          <div className={estilos.cadastro}>
            <span>Não possui uma conta?</span>

            <Link to="/cadastro">
              Cadastre-se
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Login;
