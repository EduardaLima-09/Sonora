import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import dancer from "../assets/FotoLogin.png";
import logo from "../assets/LogoBrancaSomenteNome.png";

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setErro("");

    if (!usuario || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      navigate("/home");
    }, 1000);
  }

  function handleUsuarioChange(event) {
    const value = event.target.value;
    const masked = value.replace(/[^a-zA-Z0-9\s.]/g, "");
    setUsuario(masked);
  }

  return (
    <main className={styles.login}>
      {/* LADO ESQUERDO */}
      <section className={styles.visual}>
        <div className={styles.shapePink}></div>
        <div className={styles.shapeLight}></div>

        <img
          src={dancer}
          alt="Pessoa dançando"
          className={styles.dancer}
        />
      </section>

      {/* LADO DIREITO */}
      <section className={styles.formSide}>
        <img
          src={logo}
          alt="Sonora"
          className={styles.logo}
        />

        <div className={styles.formContent}>
          <div className={styles.welcome}>
            <h1>Bem-vindo de volta!</h1>
            <p>
              <span>Porque algumas lembranças têm uma trilha sonora</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="usuario">
                Nome de usuário
              </label>

              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={handleUsuarioChange}
                placeholder="Digite seu usuário"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="senha">
                Senha
              </label>

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
                    // 👁️ OLHO ABERTO (mostrar senha)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // 👁️ OLHO FECHADO (ocultar senha)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <span className={styles.error}>
                {erro}
              </span>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className={styles.register}>
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