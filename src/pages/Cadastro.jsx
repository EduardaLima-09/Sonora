import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Cadastro.module.css";
import Loading from "../componentes/Loading";
import { api } from "../api/api"; 

import dancer from "../assets/FotoCadastro.png";
import logo from "../assets/LogoBrancaSomenteNome.png";

function Cadastro() {
  const navigate = useNavigate();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (!nomeCompleto || !usuario || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const dadosUsuario = { nomeCompleto, usuario, email, senha };
      await api.cadastrarUsuario(dadosUsuario);
      navigate("/");
    } catch (error) {
      if (error.message.includes('já cadastrado')) {
        setErro("Usuário ou e-mail já cadastrado.");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  function handleUsuarioChange(event) {
    const value = event.target.value;
    const masked = value.replace(/[^a-zA-Z0-9\s.]/g, "");
    setUsuario(masked);
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <main className={styles.cadastro}>
      {/* TODO O RESTO DO SEU JSX CONTINUA IGUAL */}
      <section className={styles.visual}>
        <div className={styles.shapePink}></div>
        <div className={styles.shapeLight}></div>
        <img src={dancer} alt="Pessoa" className={styles.dancer} />
      </section>

      <section className={styles.formSide}>
        <img src={logo} alt="Sonora" className={styles.logo} />

        <div className={styles.formContent}>
          <div className={styles.welcome}>
            <h1>Crie seu espaço.</h1>
            <p>
              <span>Guarde suas músicas.</span>
              <span>Viva suas memórias.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="nomeCompleto">Nome completo</label>
              <input
                id="nomeCompleto"
                type="text"
                value={nomeCompleto}
                onChange={(event) => setNomeCompleto(event.target.value)}
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="usuario">Nome de usuário</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={handleUsuarioChange}
                placeholder="Digite seu nome de usuário"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu e-mail"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="senha">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {erro && <span className={styles.error}>{erro}</span>}

            <button type="submit" className={styles.button} disabled={carregando}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className={styles.loginLink}>
            <span>Já possui uma conta?</span>
            <Link to="/">Faça login</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cadastro;