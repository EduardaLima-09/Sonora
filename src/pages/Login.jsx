import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import dancer from "../assets/FotoLogin.png";
import logo from "../assets/LogoCompletaBranca.png";

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setErro("");

    if (!usuario || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    setCarregando(true);

    // Temporário.
    // Depois vamos substituir pela requisição para o Back-end.
    setTimeout(() => {
      setCarregando(false);
      navigate("/home");
    }, 1000);
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
              Porque algumas lembranças têm
              <br />
              uma trilha sonora
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
                onChange={(event) => setUsuario(event.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="senha">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
              />
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